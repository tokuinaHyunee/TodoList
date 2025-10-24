import { useState, useEffect, useCallback } from "react";
import {
    getSubTodos,
    createSubTodo,
    toggleSubTodoCheck,
    type SubTodo,
    type Todo,
} from "../api/todoApi";
import SubTodoItem from "./SubTodoItem";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    const [subTodos, setSubTodos] = useState<SubTodo[]>([]);
    const [showSub, setShowSub] = useState<boolean>(false);
    const [newSub, setNewSub] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const loadSubTodos = useCallback(async () => {
        try {
            const res = await getSubTodos(todo.id);
            setSubTodos(res.data);
        } catch (error) {
            console.log("서브투두 로드 실패:", error);
        }
    }, [todo.id]);

    const handleAddSubTodo = async () => {
        if (!newSub.trim()) {
            setErrorMessage("세부 항목을 입력해주세요!");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }
        try {
            await createSubTodo(todo.id, newSub);
            setNewSub("");
            setErrorMessage("");
            loadSubTodos();
        } catch (error) {
            console.log("서브투두 추가 실패:", error);
        }
    };

    const handleSubTodoToggle = () => {
        loadSubTodos();
    };

    const handleSubTodoDelete = () => {
        loadSubTodos();
    };

    useEffect(() => {
        if (showSub) loadSubTodos();
    }, [showSub, loadSubTodos]);

        return (
            <div className="todo-item">
                <div className="todo-header">
                    <div 
                        className={`todo-checkbox ${todo.checked ? "checked" : ""}`}
                        onClick={async (e) => { 
                            e.stopPropagation(); 
                            onToggle(todo.id);
                            
                            // 메인 할일 체크 상태에 따라 세부 할일 처리
                            if (!todo.checked) {
                                // 메인 할일이 체크될 때: 모든 세부 할일도 체크
                                for (const subTodo of subTodos) {
                                    if (!subTodo.checked) {
                                        try {
                                            await toggleSubTodoCheck(subTodo.id);
                                        } catch (error) {
                                            console.log("세부 할일 체크 실패:", error);
                                        }
                                    }
                                }
                            } else {
                                // 메인 할일이 해제될 때: 모든 세부 할일도 해제
                                for (const subTodo of subTodos) {
                                    if (subTodo.checked) {
                                        try {
                                            await toggleSubTodoCheck(subTodo.id);
                                        } catch (error) {
                                            console.log("세부 할일 해제 실패:", error);
                                        }
                                    }
                                }
                            }
                            // 세부 할일 목록 새로고침
                            setTimeout(() => loadSubTodos(), 100);
                        }}
                    ></div>
                    <div
                        className={`todo-title ${todo.checked ? "checked" : ""}`}
                        onClick={() => setShowSub(!showSub)}
                    >
                        {todo.title}
                    </div>
                    <div className="todo-actions">
                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}>
                            삭제
                        </button>
                    </div>
                </div>

                {showSub && (
                    <div className="subtodo-list">
                        {subTodos.map((subTodo) => (
                            <SubTodoItem
                                key={subTodo.id}
                                subTodo={subTodo}
                                onToggle={handleSubTodoToggle}
                                onDelete={handleSubTodoDelete}
                            />
                        ))}
                        <div className="subtodo-input">
                            <input
                                value={newSub}
                                onChange={(e) => setNewSub(e.target.value)}
                                placeholder="세부 항목을 입력하세요..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSubTodo()}
                            />
                            <button onClick={handleAddSubTodo}>추가</button>
                            {errorMessage && (
                                <div className="error-tooltip">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
}
