package com.todolist.service;

import com.todolist.domain.SubTodo;
import com.todolist.domain.Todo;
import com.todolist.repository.SubTodoRepository;
import com.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 세부 할일 관리
@Service
@RequiredArgsConstructor
public class SubTodoService {
    private final SubTodoRepository subTodoRepository;
    private final TodoRepository todoRepository;
    // 특정 할일 세부목록 조회
    public List<SubTodo> getSubTodos(Long todoId) {
        return subTodoRepository.findByTodoId(todoId);
    }
    // 세부목록 추가
    public SubTodo createSubTodo(Long todoId, String title) {
        Optional<Todo> todoOptional = todoRepository.findById(todoId);
        if (todoOptional.isEmpty()) {
            throw new IllegalArgumentException("Todo not found: " + todoId);
        }
        SubTodo subTodo = SubTodo.builder()
                    .title(title)
                    .checked(false)
                    .todo(todoOptional.get())
                    .createdAt(LocalDateTime.now())
                    .build();
        return subTodoRepository.save(subTodo);
    }
    // 세부목록 체크/해제
    public SubTodo toggleCheck(Long id) {
        Optional<SubTodo> optional = subTodoRepository.findById(id);
        if (optional.isPresent()) {
            SubTodo subTodo = optional.get();
            subTodo.setChecked(!subTodo.isChecked());
            return subTodoRepository.save(subTodo);
        }
        throw new IllegalArgumentException("SubTodo not found: " + id);
    }
    // 세부목록 삭제
    public void deleteSubTodo(Long id) {
        subTodoRepository.deleteById(id);
    }
}
