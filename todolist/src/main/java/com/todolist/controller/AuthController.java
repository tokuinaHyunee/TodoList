package com.todolist.controller;

import com.todolist.dto.UserLoginRequest;
import com.todolist.dto.UserRegisterRequest;
import com.todolist.domain.User;
import com.todolist.service.UserService;
import com.todolist.util.CookieUtil;
import com.todolist.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    // 회원가입
    @PostMapping("/register")
    public User register(@RequestBody UserRegisterRequest req) {
        return userService.register(req);
    }

    // 로그인
    @PostMapping("/login")
    public String login(
            @RequestBody UserLoginRequest req,
            HttpServletResponse response,
            HttpSession session) {
        User user = userService.login(req);

        // 1) 세션에 저장 (TodoController와 일관성 유지)
        session.setAttribute("user", user.getUsername());

        // 2) JWT 발급
        String token = jwtUtil.generateToken(user.getUsername());

        // 3) JWT → HttpOnly 쿠키 저장
        Cookie cookie = cookieUtil.createHttpOnlyCookie("token", token, 60 * 60 * 24);
        response.addCookie(cookie);

        return "로그인 성공";
    }

    // 현재 로그인중인 사용자 조회
    @GetMapping("/me")
    public ResponseEntity<User> currentUser(HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            return ResponseEntity.ok().body(null);
        }
        User user = userService.findByUsername(username);
        return ResponseEntity.ok().body(user);
    }

    // 로그아웃 (세션 + 쿠키 둘 다 제거)
    @PostMapping("/logout")
    public String logout(HttpSession session, HttpServletResponse response) {

        session.invalidate();

        Cookie deleteCookie = cookieUtil.deleteCookie("token");
        response.addCookie(deleteCookie);

        return "로그아웃 완료";
    }

    // 아이디 중복 검사
    @GetMapping("/check-username")
    public Map<String, Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return Map.of("exists", exists);
    }
}
