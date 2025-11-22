package com.todolist.service;

import com.todolist.domain.Todo;
import com.todolist.domain.User;
import com.todolist.repository.TodoRepository;
import com.todolist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public List<Todo> getTodos(Long userId) {
        List<Todo> todos = todoRepository.findByUserId(userId);
        // 최신순으로 정렬
        todos.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return todos;
    }

    @Transactional(readOnly = true)
    public List<Todo> getAllTodos() {
        // 최신순으로 정렬하여 가져오기
        List<Todo> todos = todoRepository.findAllByOrderByCreatedAtDesc();
        // User와 SubTodos를 명시적으로 초기화하여 프록시 문제 방지
        todos.forEach(todo -> {
            // User 초기화 - Hibernate.initialize() 대신 직접 접근
            if (todo.getUser() != null) {
                User user = todo.getUser();
                // User의 모든 필드를 접근하여 프록시 초기화
                user.getUsername();
                user.getId();
            }
            // SubTodos 초기화
            if (todo.getSubTodos() != null) {
                // 리스트 크기를 확인하여 초기화
                todo.getSubTodos().size();
                // 각 SubTodo의 필드도 접근하여 초기화
                todo.getSubTodos().forEach(subTodo -> {
                    subTodo.getId();
                    subTodo.getTitle();
                    subTodo.isChecked();
                    subTodo.getCreatedAt();
                });
            }
        });
        return todos;
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

    public Todo findById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Todo입니다."));
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
