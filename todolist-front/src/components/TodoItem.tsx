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
    try {
      const res = await getSubTodos(todo.id);
      setSubTodos(res.data);
    } catch (error) {
      console.error("세부 항목 로드 실패:", error);
      setSubTodos([]);
    }
  }, [todo.id]);

  // SubTodo 추가
  const addSubTodo = async () => {
    if (!newSub.trim()) return;
    try {
      await createSubTodo(todo.id, newSub);
      setNewSub("");
      loadSub();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "세부 항목 추가에 실패했습니다.");
    }
  };

  useEffect(() => {
    loadSub();
  }, [loadSub]);

  // Todo 체크
  const handleMainToggle = async () => {
    if (todo.user.username !== currentUser)
      return alert("작성자만 체크할 수 있습니다.");

    try {
      await toggleTodoCheck(todo.id);
      onUpdate();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "체크 상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="todo-item">
      <div className="todo-header">
        {/* 체크박스 (작성자만 가능) */}
        {todo.user.username === currentUser && (
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

        <button
          className="delete-btn"
          onClick={() => onDeleteClick(todo.id, todo.title)}
        >
          삭제
        </button>
      </div>

      {/* SubTodo List */}
      <div className="subtodo-list">
        {subTodos.map((s) => (
          <SubTodoItem key={s.id} subTodo={s} onUpdate={loadSub} />
        ))}

        <div className="subtodo-input">
          <input
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
            placeholder="세부 항목 입력..."
          />
          <button onClick={addSubTodo}>추가</button>
        </div>
      </div>
    </div>
  );
}
