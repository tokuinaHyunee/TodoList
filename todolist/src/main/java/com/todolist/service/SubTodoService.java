package com.todolist.service;

import com.todolist.domain.SubTodo;
import com.todolist.domain.Todo;
import com.todolist.repository.SubTodoRepository;
import com.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubTodoService {
    private final SubTodoRepository subTodoRepository;
    private final TodoRepository todoRepository;

    public List<SubTodo> getSubTodos(Long todoId) {
        return subTodoRepository.findByTodoId(todoId);
    }

    public SubTodo createSubTodo(Long todoId, String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("제목을 입력해주세요.");
        }
        
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 Todo입니다."));
        
        SubTodo subTodo = SubTodo.builder()
                .title(title.trim())
                .checked(false)
                .todo(todo)
                .createdAt(LocalDateTime.now())
                .build();
        return subTodoRepository.save(subTodo);
    }

    public SubTodo toggleCheck(Long id) {
        SubTodo subTodo = subTodoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 SubTodo입니다."));
        subTodo.setChecked(!subTodo.isChecked());
        return subTodoRepository.save(subTodo);
    }

    public void deleteSubTodo(Long id) {
        subTodoRepository.deleteById(id);
    }

    public SubTodo findById(Long id) {
        return subTodoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 SubTodo입니다."));
    }

    public SubTodo updateSubTodoTitle(Long id, String newTitle) {
        if (newTitle == null || newTitle.trim().isEmpty()) {
            throw new RuntimeException("제목을 입력해주세요.");
        }
        
        SubTodo subTodo = subTodoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 SubTodo입니다."));
        subTodo.setTitle(newTitle.trim());
        return subTodoRepository.save(subTodo);
    }

    // 특정 Todo의 모든 SubTodo를 체크/언체크
    @Transactional
    public void toggleAllSubTodosByTodoId(Long todoId, boolean checked) {
        List<SubTodo> subTodos = subTodoRepository.findByTodoId(todoId);
        for (SubTodo subTodo : subTodos) {
            subTodo.setChecked(checked);
            subTodoRepository.save(subTodo);
        }
    }
}
