package com.todolist.controller;

import com.todolist.dto.UserLoginRequest;
import com.todolist.dto.UserRegisterRequest;
import com.todolist.domain.User;
import com.todolist.service.UserService;

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

    // 회원가입
    @PostMapping("/register")
    public User register(@RequestBody UserRegisterRequest req) {
        return userService.register(req);
    }

    // 로그인
    @PostMapping("/login")
    public String login(
            @RequestBody UserLoginRequest req,
            HttpSession session) {
        User user = userService.login(req);

        // 세션에 저장
        session.setAttribute("user", user.getUsername());

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

    // 로그아웃
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "로그아웃 완료";
    }

    // 아이디 중복 검사
    @GetMapping("/check-username")
    public Map<String, Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return Map.of("exists", exists);
    }
}
