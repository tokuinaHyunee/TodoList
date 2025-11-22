package com.todolist.service;

import com.todolist.domain.Todo;
import com.todolist.domain.User;
import com.todolist.repository.TodoRepository;
import com.todolist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public List<Todo> getTodos(Long userId) {
        return todoRepository.findByUserId(userId);
    }

    public Todo createTodo(Long userId, String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("제목을 입력해주세요.");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        
        Todo todo = Todo.builder()
                .title(title.trim())
                .checked(false)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    public Todo toggleCheck(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Todo입니다."));
        todo.setChecked(!todo.isChecked());
        return todoRepository.save(todo);
    }

    public Todo updateTodoTitle(Long id, String newTitle) {
        if (newTitle == null || newTitle.trim().isEmpty()) {
            throw new RuntimeException("제목을 입력해주세요.");
        }
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Todo입니다."));
        todo.setTitle(newTitle.trim());
        return todoRepository.save(todo);
    }
}
