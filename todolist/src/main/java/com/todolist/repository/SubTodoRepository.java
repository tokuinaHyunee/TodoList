package com.todolist.repository;

import com.todolist.domain.SubTodo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubTodoRepository extends JpaRepository<SubTodo, Long> {
    List<SubTodo> findByTodoId(Long todoId);
}
