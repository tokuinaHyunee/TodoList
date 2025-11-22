import { useState } from "react";
import type { SubTodo } from "../api/todoApi";
import { toggleSubTodoCheck, deleteSubTodo, updateSubTodo } from "../api/todoApi";

interface Props {
  subTodo: SubTodo;
  onUpdate: () => void;
  isOwner: boolean; // 할일 작성자 여부
}

export default function SubTodoItem({ subTodo, onUpdate, isOwner }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subTodo.title);

  const handleToggle = async () => {
    await toggleSubTodoCheck(subTodo.id);
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteSubTodo(subTodo.id);
    onUpdate();
  };

  // 세부 할일 제목 수정 저장
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    if (editTitle.trim() === subTodo.title) {
      setIsEditing(false);
      return;
    }

    await updateSubTodo(subTodo.id, editTitle.trim());
    setIsEditing(false);
    onUpdate();
  };

  // Enter 키로 수정 저장
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(subTodo.title);
    }
  };

  return (
    <div className="subtodo-item">
      {/* 체크박스 (작성자만 표시) */}
      {isOwner && (
        <div
          className={`subtodo-checkbox ${subTodo.checked ? "checked" : ""}`}
          onClick={handleToggle}
        ></div>
      )}

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="subtodo-title-edit"
          placeholder="세부 항목 제목"
          autoFocus
        />
      ) : (
        <div className={`subtodo-title ${subTodo.checked ? "checked" : ""}`}>
          {subTodo.title}
        </div>
      )}

      {/* 수정/삭제 버튼 (작성자만 표시) */}
      {isOwner && (
        <>
          <button
            className="edit-btn"
            onClick={() => {
              setIsEditing(true);
              setEditTitle(subTodo.title);
            }}
          >
            수정
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
        </>
      )}
    </div>
  );
}
