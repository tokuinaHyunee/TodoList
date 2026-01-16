package com.todolist.service;

import com.todolist.domain.User;
import com.todolist.dto.UserLoginRequest;
import com.todolist.dto.UserRegisterRequest;
import com.todolist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 회원가입
    public User register(UserRegisterRequest req) {
        System.out.println("register 메서드 호출" + req.getPassword());
        // 아이디 중복 검증
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 비밀번호 검증: 영어 소문자 + 특수문자 필수
        String password = req.getPassword();
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("비밀번호를 입력해주세요.");
        }
        
        boolean hasLowerCase = password.matches(".*[a-z].*");
        boolean hasSpecialChar = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");
        
        if (!hasLowerCase) {
            throw new RuntimeException("비밀번호에 영어 소문자를 포함해주세요.");
        }
        
        if (!hasSpecialChar) {
            throw new RuntimeException("비밀번호에 특수문자를 포함해주세요.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .username(req.getUsername())
                .password(encodedPassword)
                .build();

        return userRepository.save(user);
    }

    // 로그인
    public User login(UserLoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));

        // 암호화된 비밀번호와 비교
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    // 사용자명 기반 조회
    public User loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    // ID 기반 조회 (AuthController가 사용)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + id));
    }

    // 사용자명 기반 조회 (TodoController가 사용)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    // 아이디 중복 확인
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
