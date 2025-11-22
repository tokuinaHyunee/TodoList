package com.todolist.controller;

import com.todolist.domain.SubTodo;
import com.todolist.domain.Todo;
import com.todolist.domain.User;
import com.todolist.service.SubTodoService;
import com.todolist.service.TodoService;
import com.todolist.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subtodos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SubTodoController {
    private final SubTodoService subTodoService;
    private final TodoService todoService;
    private final UserService userService;

    // 특정 Todo의 세부목록 조회
    @GetMapping("/{todoId}")
    public List<SubTodo> getSubTodos(@PathVariable Long todoId) {
        return subTodoService.getSubTodos(todoId);
    }

    // 세부목록 추가
    @PostMapping("/{todoId}")
    public SubTodo createSubTodo(@PathVariable Long todoId, @RequestBody Map<String, String> body, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // Todo 작성자 확인
        Todo todo = todoService.findById(todoId);
        if (todo == null) {
            throw new RuntimeException("존재하지 않는 Todo입니다.");
        }
        
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 세부 항목을 추가할 수 있습니다.");
        }
        
        return subTodoService.createSubTodo(todoId, body.get("title"));
    }

    // 체크 토글
    @PatchMapping("/{id}/check")
    public SubTodo toggleCheck(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // SubTodo의 Todo 작성자 확인
        SubTodo subTodo = subTodoService.findById(id);
        if (subTodo == null) {
            throw new RuntimeException("존재하지 않는 SubTodo입니다.");
        }
        
        Todo todo = subTodo.getTodo();
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 체크할 수 있습니다.");
        }
        
        return subTodoService.toggleCheck(id);
    }

    // 수정
    @PatchMapping("/{id}")
    public SubTodo updateSubTodo(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // SubTodo의 Todo 작성자 확인
        SubTodo subTodo = subTodoService.findById(id);
        if (subTodo == null) {
            throw new RuntimeException("존재하지 않는 SubTodo입니다.");
        }
        
        Todo todo = subTodo.getTodo();
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }
        
        return subTodoService.updateSubTodoTitle(id, body.get("title"));
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void deleteSubTodo(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        
        // SubTodo의 Todo 작성자 확인
        SubTodo subTodo = subTodoService.findById(id);
        if (subTodo == null) {
            throw new RuntimeException("존재하지 않는 SubTodo입니다.");
        }
        
        Todo todo = subTodo.getTodo();
        User user = userService.findByUsername(username);
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("작성자만 삭제할 수 있습니다.");
        }
        
        subTodoService.deleteSubTodo(id);
    }
}
