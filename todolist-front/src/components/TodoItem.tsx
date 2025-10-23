import { useState, useEffect, useCallback } from "react";
import {
    getSubTodos,
    createSubTodo,
    toggleSubTodoCheck,
    deleteSubTodo,
    type SubTodo,
    type Todo,
} from "../api/todoApi";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    const [subTodos, setSubTodos] = useState<SubTodo[]>([]);
    const [showSub, setShowSub] = useState<boolean>(false);
    const [newSub, setNewSub] = useState<string>("");

    const loadSubTodos = useCallback(async () => {
        try {
            const res = await getSubTodos(todo.id);
            setSubTodos(res.data);
        } catch (error) {
            console.log("서브투두 로드 실패:", error);
        }
    }, [todo.id]);

    const handleAddSubTodo = async () => {
        if (!newSub.trim()) return;
        try {
            await createSubTodo(todo.id, newSub);
            setNewSub("");
            loadSubTodos();
        } catch (error) {
            console.log("서브투두 추가 실패:", error);
        }
    };

    const handleToggleSub = async (id: number) => {
        try {
            await toggleSubTodoCheck(id);
            loadSubTodos();
        } catch (error) {
            console.log("서브투두 토글 실패:", error);
        }
    };

    const handleDeleteSub = async (id: number) => {
        try {
            await deleteSubTodo(id);
            loadSubTodos();
        } catch (error) {
            console.log("서브투두 삭제 실패:", error);
        }
    };

    useEffect(() => {
        if (showSub) loadSubTodos();
    }, [showSub]);

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
                        {subTodos.map((s) => (
                            <div key={s.id} className="subtodo-item">
                                <div 
                                    className={`subtodo-checkbox ${s.checked ? "checked" : ""}`}
                                    onClick={() => handleToggleSub(s.id)}
                                ></div>
                                <div className={`subtodo-title ${s.checked ? "checked" : ""}`}>
                                    {s.title}
                                </div>
                                <div className="subtodo-actions">
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteSub(s.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="subtodo-input">
                            <input
                                value={newSub}
                                onChange={(e) => setNewSub(e.target.value)}
                                placeholder="세부 항목을 입력하세요..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSubTodo()}
                            />
                            <button onClick={handleAddSubTodo}>추가</button>
                        </div>
                    </div>
                )}
        </div>
    );
}
