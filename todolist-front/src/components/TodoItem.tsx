import { useState, useEffect, useCallback } from "react";
import {
  getSubTodos,
  createSubTodo,
  toggleTodoCheck,
  type SubTodo,
  type Todo,
} from "../api/todoApi";
import SubTodoItem from "./SubTodoItem";

interface Props {
  todo: Todo;
  currentUser: string | null;
  onUpdate: () => void;
  onDeleteClick: (id: number, title: string) => void;
}

export default function TodoItem({
  todo,
  currentUser,
  onUpdate,
  onDeleteClick,
}: Props) {
  const [subTodos, setSubTodos] = useState<SubTodo[]>([]);
  const [newSub, setNewSub] = useState("");

  const loadSub = useCallback(async () => {
    const res = await getSubTodos(todo.id);
    setSubTodos(res.data);
  }, [todo.id]);

  // SubTodo 추가
  const addSubTodo = async () => {
    if (!newSub.trim()) return;
    await createSubTodo(todo.id, newSub);
    setNewSub("");
    loadSub();
  };

  useEffect(() => {
    loadSub();
  }, [loadSub]);

  // Todo 체크
  const handleMainToggle = async () => {
    if (!todo.user || todo.user.username !== currentUser)
      return alert("작성자만 체크할 수 있습니다.");

    await toggleTodoCheck(todo.id);
    onUpdate();
  };

  return (
    <div className="todo-item">
      <div className="todo-header">
        {/* 체크박스 (작성자만 가능) */}
        {todo.user && todo.user.username === currentUser && (
          <div
            className={`todo-checkbox ${todo.checked ? "checked" : ""}`}
            onClick={handleMainToggle}
          ></div>
        )}

        <div className={`todo-title ${todo.checked ? "checked" : ""}`}>
          {todo.title}
        </div>

        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleString()}
        </span>

        {/* 삭제 버튼 (작성자만 표시) */}
        {todo.user && todo.user.username === currentUser && (
          <button
            className="delete-btn"
            onClick={() => onDeleteClick(todo.id, todo.title)}
          >
            삭제
          </button>
        )}
      </div>

      {/* 세부 할일 목록 */}
      <div className="subtodo-list">
        {subTodos.map((s) => (
          <SubTodoItem 
            key={s.id} 
            subTodo={s} 
            onUpdate={loadSub}
            isOwner={todo.user ? todo.user.username === currentUser : false}
          />
        ))}

        {/* SubTodo 입력 (작성자만 표시) */}
        {todo.user && todo.user.username === currentUser && (
          <div className="subtodo-input">
            <input
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              placeholder="세부 항목 입력..."
            />
            <button onClick={addSubTodo}>추가</button>
          </div>
        )}
      </div>
    </div>
  );
}
