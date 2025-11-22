package com.todolist.controller;

import com.todolist.domain.Todo;
import com.todolist.domain.User;
import com.todolist.service.TodoService;
import com.todolist.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    @GetMapping
    public List<Todo> getTodos(HttpSession session) {
        // 모든 Todo 반환 (로그인 여부와 관계없이)
        return todoService.getAllTodos();
    }

    @GetMapping("/my")
    public List<Todo> getMyTodos(HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null)
            return List.of();

        User user = userService.findByUsername(username);
        return todoService.getTodos(user.getId());
    }

    @PostMapping
    public Todo createTodo(@RequestBody Map<String, String> body, HttpSession session) {
        String username = (String) session.getAttribute("user");
        User user = userService.findByUsername(username);
        return todoService.createTodo(user.getId(), body.get("title"));
    }

    @PatchMapping("/{id}/check")
    public Todo toggleCheck(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // 작성자 확인
        Todo todo = todoService.findById(id);
        if (todo == null) {
            throw new RuntimeException("존재하지 않는 Todo입니다.");
        }
        
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 체크할 수 있습니다.");
        }
        
        return todoService.toggleCheck(id);
    }

    @PatchMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // 작성자 확인
        Todo todo = todoService.findById(id);
        if (todo == null) {
            throw new RuntimeException("존재하지 않는 Todo입니다.");
        }
        
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }
        
        return todoService.updateTodoTitle(id, body.get("title"));
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // 작성자 확인
        Todo todo = todoService.findById(id);
        if (todo == null) {
            throw new RuntimeException("존재하지 않는 Todo입니다.");
        }
        
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 삭제할 수 있습니다.");
        }
        
        todoService.deleteTodo(id);
    }
}
