import { useState, useEffect } from "react";
import AuthModal from "../components/AuthModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import TodoItem from "../components/TodoItem";
import { getTodos, type Todo } from "../api/todoApi";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const loadTodos = async () => {
    try {
      const res = await getTodos();
      // res.data가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("할일 목록 로드 실패:", error);
      setTodos([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  // 로그인 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include", // 쿠키 포함
        });
        if (res.ok) {
          const userData = await res.json();
          if (userData && userData.username) {
            setUser(userData.username);
            loadTodos();
          }
        }
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Todo 추가
  const addTodo = async () => {
    if (!user) return alert("로그인 후 이용가능");
    if (!newTodo.trim()) return alert("할일을 입력해주세요.");
    
    try {
      const res = await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ title: newTodo }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "할일 추가에 실패했습니다.");
      }
      
      setNewTodo("");
      loadTodos();
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert(err.message || "할일 추가에 실패했습니다.");
    }
  };

  // Todo 삭제
  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include", // 쿠키 포함
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "할일 삭제에 실패했습니다.");
      }
      
      setDeleteTarget(null);
      loadTodos();
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert(err.message || "할일 삭제에 실패했습니다.");
      setDeleteTarget(null);
    }
  };

  // todos가 배열인지 확인하고 필터링
  const filtered = Array.isArray(todos)
    ? todos.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.user.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="container">
        <h2>📝 Todo List</h2>

        {/* 검색창과 로그인 버튼 같은 라인 */}
        <div className="search-row">
          <div className="search-box">
            <input
              placeholder="검색 (제목 / 아이디)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="auth-bar">
            {user ? (
              <>
                <span>{user}님</span>
                <button
                  onClick={async () => {
                    await fetch("http://localhost:8080/api/auth/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                    window.location.reload();
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)}>
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>

        <div className="todo-input-container">
          <input
            placeholder="새 할일 입력"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo}>추가</button>
        </div>

      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentUser={user}
          onUpdate={loadTodos}
          onDeleteClick={(id, title) => setDeleteTarget({ id, title })}
        />
      ))}

      {/* 모달 */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            setShowAuthModal(false);
            window.location.reload();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.title}
          onConfirm={() => deleteTodo(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      </div>
    </>
  );
}
