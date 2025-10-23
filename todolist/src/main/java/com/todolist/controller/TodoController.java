package com.todolist.controller;

import com.todolist.domain.Todo;
import com.todolist.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 프론트에서 요청 가능하도록 CORS 허용
public class TodoController {
    private final TodoService todoService;
    // 전체 목록 조회
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }
    // 목록 추가
    @PostMapping
    public Todo createTodo(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        return todoService.createTodo(title);
    }
    // 목록 삭제
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
    // 체크 토글
    @PatchMapping("/{id}/check")
    public Todo toggleCheck(@PathVariable Long id) {
        return todoService.toggleCheck(id);
    }
}
