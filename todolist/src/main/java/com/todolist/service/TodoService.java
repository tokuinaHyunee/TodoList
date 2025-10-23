package com.todolist.service;

import com.todolist.domain.Todo;
import com.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// crud, 체크 토클 로직
@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    // 전체 목록 조회
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }
    // 작성
    public Todo createTodo(String title) {
        Todo todo = Todo.builder()
                    .title(title)
                    .checked(false)
                    .createdAt(LocalDateTime.now())
                    .build();
        return todoRepository.save(todo);
    }
    // 삭제
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
    // 체크 상태 토글 완료/해제
    public Todo toggleCheck(Long id) {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent()) {
            Todo todo = optionalTodo.get();
            todo.setChecked(!todo.isChecked());
            return todoRepository.save(todo);
        }
        throw new IllegalArgumentException("Todo not found: " + id);
    }
}
