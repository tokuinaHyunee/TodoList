package com.todolist.repository;

import com.todolist.domain.SubTodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// 특정 메인에 속한 세부 목록 조회 메서드 추가
@Repository
public interface SubTodoRepository extends JpaRepository<SubTodo, Long> {
    List<SubTodo> findByTodoId(Long todoId);
}
