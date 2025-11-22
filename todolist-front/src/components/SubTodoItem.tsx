import type { SubTodo } from "../api/todoApi";
import { toggleSubTodoCheck, deleteSubTodo } from "../api/todoApi";

interface Props {
  subTodo: SubTodo;
  onUpdate: () => void;
}

export default function SubTodoItem({ subTodo, onUpdate }: Props) {
  const handleToggle = async () => {
    try {
      await toggleSubTodoCheck(subTodo.id);
      onUpdate();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "체크 상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubTodo(subTodo.id);
      onUpdate();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div className="subtodo-item">
      <div
        className={`subtodo-checkbox ${subTodo.checked ? "checked" : ""}`}
        onClick={handleToggle}
      ></div>

      <div className={`subtodo-title ${subTodo.checked ? "checked" : ""}`}>
        {subTodo.title}
      </div>

      <button className="delete-btn" onClick={handleDelete}>
        삭제
      </button>
    </div>
  );
}
