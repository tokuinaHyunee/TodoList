package com.todolist.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    // JWT 서명용 키 (실서비스에서는 환경변수로 관리)
    // 최소 256비트(32바이트) 필요
    private final String SECRET_KEY = "mysecretkey123456789012345678901234567890";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // JWT 유효기간 (1일)
    private final long EXPIRATION = 1000 * 60 * 60 * 24;

    // JWT 생성
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // 토큰 주인
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    // 사용자 아이디 추출
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
