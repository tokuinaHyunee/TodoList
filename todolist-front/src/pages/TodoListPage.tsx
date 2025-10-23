import { useState, useEffect } from "react";
import {
    getTodos,
    createTodo,
    deleteTodo,
    toggleTodoCheck,
    type Todo,
} from "../api/todoApi";
import TodoItem from "../components/TodoItem";

export default function TodoListPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>("");

    const loadTodos = async () => {
        try {
            const res = await getTodos();
            setTodos(res.data);
        } catch (error) {
            console.log("데이터 로드 실패:", error);
        }
    };

    const handleAdd = async () => {
        if (!newTodo.trim()) return;
        try {
            await createTodo(newTodo);
            setNewTodo("");
            loadTodos();
        } catch (error) {
            console.log("추가 실패:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTodo(id);
            loadTodos();
        } catch (error) {
            console.log("삭제 실패:", error);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await toggleTodoCheck(id);
            loadTodos();
        } catch (error) {
            console.log("토글 실패:", error);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

        return (
            <div className="container">
                <h2>📝 Todo List</h2>
                <div className="todo-input-container">
                    <input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="새로운 할 일을 입력하세요..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button onClick={handleAdd}>추가</button>
                </div>
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        );
}
