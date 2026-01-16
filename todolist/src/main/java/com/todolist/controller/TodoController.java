package com.todolist.controller;

import com.todolist.domain.Todo;
import com.todolist.domain.User;
import com.todolist.service.TodoService;
import com.todolist.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    /**
     * 모든 Todo 조회 (페이징 지원)
     * @param page 페이지 번호 (0부터 시작, 기본값: 0)
     * @param size 페이지 크기 (기본값: 10)
     * @param session HTTP 세션
     * @return 페이징된 Todo 목록
     */
    @GetMapping
    public Page<Todo> getTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        // Pageable 객체 생성: 페이지 번호, 크기, 정렬 정보 설정
        // Sort.by("createdAt").descending() - 최신순 정렬
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // 페이징된 Todo 목록 반환
        return todoService.getAllTodos(pageable);
    }

    /**
     * 내가 작성한 Todo 조회 (페이징 지원)
     * @param page 페이지 번호 (0부터 시작, 기본값: 0)
     * @param size 페이지 크기 (기본값: 10)
     * @param session HTTP 세션
     * @return 페이징된 Todo 목록
     */
    @GetMapping("/my")
    public Page<Todo> getMyTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        String username = (String) session.getAttribute("user");
        if (username == null) {
            // 로그인하지 않은 경우 빈 페이지 반환
            return Page.empty();
        }

        User user = userService.findByUsername(username);
        
        // Pageable 객체 생성: 페이지 번호, 크기, 정렬 정보 설정
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // 페이징된 Todo 목록 반환
        return todoService.getTodos(user.getId(), pageable);
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
