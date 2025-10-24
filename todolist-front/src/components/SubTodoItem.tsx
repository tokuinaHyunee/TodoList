import {
    toggleSubTodoCheck,
    deleteSubTodo,
    type SubTodo,
} from "../api/todoApi";

interface SubTodoItemProps {
    subTodo: SubTodo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function SubTodoItem({ subTodo, onToggle, onDelete }: SubTodoItemProps) {
    const handleToggle = async () => {
        try {
            await toggleSubTodoCheck(subTodo.id);
            onToggle(subTodo.id);
        } catch (error) {
            console.log("서브투두 토글 실패:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSubTodo(subTodo.id);
            onDelete(subTodo.id);
        } catch (error) {
            console.log("서브투두 삭제 실패:", error);
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
            <div className="subtodo-actions">
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    삭제
                </button>
            </div>
        </div>
    );
}
