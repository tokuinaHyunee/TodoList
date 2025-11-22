import { useState, useEffect } from "react";
import AuthModal from "../components/AuthModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import TodoItem from "../components/TodoItem";
import { getTodos, getMyTodos, createTodo, deleteTodo, getCurrentUser, logout, type Todo } from "../api/todoApi";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMyTodosOnly, setShowMyTodosOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const loadTodos = async () => {
    try {
      const res = await getTodos();
      
      // res.data가 배열인지 확인
      const todosData = res.data;
      
      // 배열인 경우 정렬하여 설정
      if (Array.isArray(todosData)) {
        const sortedTodos = [...todosData].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
        setTodos(sortedTodos);
      } else {
        // 배열이 아닌 경우 빈 배열로 설정
        setTodos([]);
      }
    } catch {
      // 백엔드 미실행 시 조용히 처리
      setTodos([]);
    }
  };

  const loadMyTodos = async () => {
    if (!user) {
      setShowMyTodosOnly(false);
      return;
    }
    
    try {
      const res = await getMyTodos();
      const todosData = res.data;
      if (Array.isArray(todosData)) {
        const sortedTodos = [...todosData].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
        setTodos(sortedTodos);
      } else {
        setTodos([]);
      }
    } catch {
      // 백엔드 미실행 시 조용히 처리
      setTodos([]);
    }
  };

  // 로그인 확인 및 초기 데이터 로드
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        const userData = res.data;
        if (userData && userData.username) {
          setUser(userData.username);
        } else {
          setUser(null);
        }
      } catch {
        // 백엔드 미실행 시 조용히 처리
        setUser(null);
      }
    };
    
    // 인증 확인과 글 목록 로드를 독립적으로 실행
    checkAuth().catch(() => setUser(null));
    loadTodos().catch(() => setTodos([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Todo 추가
  const addTodo = async () => {
    if (!user) return alert("로그인 후 이용가능");
    if (!newTodo.trim()) return alert("할일을 입력해주세요.");
    
    // axios를 사용하여 일관성 유지
    await createTodo(newTodo.trim());
    
    setNewTodo("");
    // 목록 새로고침
    await loadTodos();
  };

  // Todo 삭제
  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setDeleteTarget(null);
    loadTodos();
  };

  // todos가 배열인지 확인하고 필터링 및 정렬
  const filtered = Array.isArray(todos)
    ? todos
        .filter((t) => {
          // 자기글만 보기 필터
          if (showMyTodosOnly && user) {
            if (!t.user || t.user.username !== user) {
              return false;
            }
          }
          // 검색 필터
          return (
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.user && t.user.username.toLowerCase().includes(search.toLowerCase()))
          );
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        })
    : [];

  // 자기글만 보기 토글
  const handleMyTodosToggle = () => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    
    const newValue = !showMyTodosOnly;
    setShowMyTodosOnly(newValue);
    
    if (newValue) {
      loadMyTodos();
    } else {
      loadTodos();
    }
  };

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
                    await logout();
                    window.location.reload();
                  }}
                >
                  로그아웃
                </button>
                <button
                  className={`my-todos-button ${showMyTodosOnly ? "active" : ""}`}
                  onClick={handleMyTodosToggle}
                >
                  {showMyTodosOnly ? "✓ " : ""}내가 작성한 글
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />
          <button onClick={addTodo}>추가</button>
        </div>

        {/* 정렬 링크 */}
        <div className="sort-links">
          <a
            href="#"
            className={sortOrder === "newest" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortOrder("newest");
            }}
          >
            최신순
          </a>
          <span> | </span>
          <a
            href="#"
            className={sortOrder === "oldest" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSortOrder("oldest");
            }}
          >
            오래된순
          </a>
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
          onConfirm={() => handleDeleteTodo(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      </div>
    </>
  );
}
