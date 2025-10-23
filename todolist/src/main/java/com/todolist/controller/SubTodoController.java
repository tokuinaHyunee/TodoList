package com.todolist.controller;


import com.todolist.domain.SubTodo;
import com.todolist.service.SubTodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subtodos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SubTodoController {
    private final SubTodoService subTodoService;
    // 특정 할일의 세부목록 조회
    @GetMapping("/{todoId}")
    public List<SubTodo> getSubTodos(@PathVariable Long todoId) {
        return subTodoService.getSubTodos(todoId);
    }
    // 세부 목록 추가
    @PostMapping("/{todoId}")
    public SubTodo createSubTodo(@PathVariable Long todoId, @RequestBody Map<String, String> body) {
        String title = body.get("title");
        return subTodoService.createSubTodo(todoId, title);
    }
    // 세부목록 체크 토글
    @PatchMapping("/{id}/check")
    public SubTodo toggleCheck(@PathVariable Long id) {
        return subTodoService.toggleCheck(id);
    }
    // 세부 목록 삭제
    @DeleteMapping("/{id}")
    public void deleteSubTodo(@PathVariable Long id) {
        subTodoService.deleteSubTodo(id);
    }
}
