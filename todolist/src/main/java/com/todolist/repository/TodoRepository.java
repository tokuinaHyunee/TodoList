package com.todolist.repository;

import com.todolist.domain.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // 사용자 ID로 Todo 조회 (페이징 없음 - 기존 호환성 유지)
    List<Todo> findByUserId(Long userId);
    
    // 모든 Todo를 최신순으로 조회 (페이징 없음 - 기존 호환성 유지)
    List<Todo> findAllByOrderByCreatedAtDesc();
    
    // 페이징 처리: 모든 Todo를 최신순으로 조회 (페이징 지원)
    // Pageable 파라미터로 페이지 번호와 크기를 받아 페이징된 결과 반환
    Page<Todo> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 페이징 처리: 특정 사용자의 Todo를 최신순으로 조회 (페이징 지원)
    // Pageable 파라미터로 페이지 번호와 크기를 받아 페이징된 결과 반환
    Page<Todo> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
