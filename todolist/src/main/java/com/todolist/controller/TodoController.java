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
    public Todo toggleCheck(@PathVariable Long id) {
        return todoService.toggleCheck(id);
    }

    @PatchMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return todoService.updateTodoTitle(id, body.get("title"));
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
