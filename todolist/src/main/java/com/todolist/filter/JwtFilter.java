package com.todolist.filter;

import com.todolist.service.UserService;
import com.todolist.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1) 쿠키에서 JWT 추출
        String token = null;

        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("token".equals(c.getName())) {
                    token = c.getValue();
                }
            }
        }

        // 2) 토큰 없으면 다음 필터로
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 3) 토큰에서 username 추출
            String username = jwtUtil.extractUsername(token);
            var user = userService.loadUserByUsername(username);

            // 4) 인증 객체 생성 → SecurityContext 등록
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    user, null, null);

            SecurityContextHolder.getContext().setAuthentication(auth);

            // 5) 세션에도 저장 (TodoController 호환성)
            HttpSession session = request.getSession(true);
            session.setAttribute("user", username);

        } catch (Exception e) {
            System.out.println("JWT 인증 실패: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
