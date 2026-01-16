import { useState, useEffect } from "react";
import AuthModal from "../components/AuthModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import TodoItem from "../components/TodoItem";
import { getTodos, getMyTodos, createTodo, deleteTodo, getCurrentUser, logout, type Todo, type PageResponse } from "../api/todoApi";

export default function TodoListPage() {
  // Todo 목록 상태 (페이징된 데이터)
  const [todos, setTodos] = useState<Todo[]>([]);
  // 페이징 정보 상태
  const [pageInfo, setPageInfo] = useState<{
    totalPages: number;
    currentPage: number;
    totalElements: number;
  }>({
    totalPages: 0,
    currentPage: 0,
    totalElements: 0,
  });
  // 페이지 크기 (한 페이지에 표시할 항목 수)
  const [pageSize] = useState(10);
  // 현재 페이지 번호 (0부터 시작)
  const [currentPage, setCurrentPage] = useState(0);
  
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

  /**
   * 모든 Todo 조회 (페이징 지원)
   * @param page 페이지 번호 (0부터 시작)
   */
  const loadTodos = async (page: number = 0) => {
    try {
      // 페이징 파라미터로 API 호출
      const res = await getTodos({ page, size: pageSize });
      const pageData: PageResponse<Todo> = res.data;
      
      // 페이징된 데이터 설정
      setTodos(pageData.content || []);
      // 페이징 정보 업데이트
      setPageInfo({
        totalPages: pageData.totalPages || 0,
        currentPage: pageData.number || 0,
        totalElements: pageData.totalElements || 0,
      });
      // 현재 페이지 상태 업데이트
      setCurrentPage(pageData.number || 0);
    } catch {
      // 백엔드 미실행 시 조용히 처리
      setTodos([]);
      setPageInfo({ totalPages: 0, currentPage: 0, totalElements: 0 });
    }
  };

  /**
   * 내가 작성한 Todo 조회 (페이징 지원)
   * @param page 페이지 번호 (0부터 시작)
   */
  const loadMyTodos = async (page: number = 0) => {
    if (!user) {
      setShowMyTodosOnly(false);
      return;
    }
    
    try {
      // 페이징 파라미터로 API 호출
      const res = await getMyTodos({ page, size: pageSize });
      const pageData: PageResponse<Todo> = res.data;
      
      // 페이징된 데이터 설정
      setTodos(pageData.content || []);
      // 페이징 정보 업데이트
      setPageInfo({
        totalPages: pageData.totalPages || 0,
        currentPage: pageData.number || 0,
        totalElements: pageData.totalElements || 0,
      });
      // 현재 페이지 상태 업데이트
      setCurrentPage(pageData.number || 0);
    } catch {
      // 백엔드 미실행 시 조용히 처리
      setTodos([]);
      setPageInfo({ totalPages: 0, currentPage: 0, totalElements: 0 });
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
    loadTodos(0).catch(() => setTodos([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 페이지 변경 시 데이터 다시 로드
  useEffect(() => {
    if (showMyTodosOnly) {
      loadMyTodos(currentPage);
    } else {
      loadTodos(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showMyTodosOnly]);

  // Todo 추가
  const addTodo = async () => {
    if (!user) return alert("로그인 후 이용가능");
    if (!newTodo.trim()) return alert("할일을 입력해주세요.");
    
    // axios를 사용하여 일관성 유지
    await createTodo(newTodo.trim());
    
    setNewTodo("");
    // 목록 새로고침 (첫 페이지로 이동)
    setCurrentPage(0);
    if (showMyTodosOnly) {
      await loadMyTodos(0);
    } else {
      await loadTodos(0);
    }
  };

  // Todo 삭제
  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setDeleteTarget(null);
    // 삭제 후 현재 페이지 다시 로드
    if (showMyTodosOnly) {
      loadMyTodos(currentPage);
    } else {
      loadTodos(currentPage);
    }
  };

  // 검색 필터링 (클라이언트 측 필터링 - 페이징된 데이터 내에서만 검색)
  // 주의: 서버 측 페이징이므로 검색은 현재 페이지의 데이터에만 적용됨
  const filtered = Array.isArray(todos)
    ? todos.filter((t) => {
        // 검색 필터 (제목 또는 작성자명으로 검색)
        return (
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.user && t.user.username.toLowerCase().includes(search.toLowerCase()))
        );
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
    // 첫 페이지로 리셋
    setCurrentPage(0);
    
    if (newValue) {
      loadMyTodos(0);
    } else {
      loadTodos(0);
    }
  };

  /**
   * 페이지 변경 핸들러
   * @param newPage 이동할 페이지 번호 (0부터 시작)
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * 이전 페이지로 이동
   */
  const handlePrevPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  /**
   * 다음 페이지로 이동
   */
  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) {
      handlePageChange(currentPage + 1);
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
          <span className="active">최신순</span>
          <span style={{ marginLeft: "1rem", color: "#666" }}>
            전체 {pageInfo.totalElements}개 | 페이지 {currentPage + 1} / {pageInfo.totalPages || 1}
          </span>
        </div>

      {/* Todo 목록 표시 */}
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          currentUser={user}
          onUpdate={() => {
            // Todo 업데이트 후 현재 페이지 다시 로드
            if (showMyTodosOnly) {
              loadMyTodos(currentPage);
            } else {
              loadTodos(currentPage);
            }
          }}
          onDeleteClick={(id, title) => setDeleteTarget({ id, title })}
        />
      ))}

      {/* 페이징 UI */}
      {pageInfo.totalPages > 1 && (
        <div className="pagination">
          {/* 이전 페이지 버튼 */}
          <button
            className="page-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            이전
          </button>

          {/* 페이지 번호 버튼들 */}
          {Array.from({ length: pageInfo.totalPages }, (_, i) => i).map((pageNum) => {
            // 현재 페이지 주변의 페이지 번호만 표시 (최대 5개)
            const startPage = Math.max(0, currentPage - 2);
            const endPage = Math.min(pageInfo.totalPages - 1, currentPage + 2);
            
            // 첫 페이지, 마지막 페이지, 현재 페이지 주변만 표시
            if (
              pageNum === 0 ||
              pageNum === pageInfo.totalPages - 1 ||
              (pageNum >= startPage && pageNum <= endPage)
            ) {
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            } else if (
              pageNum === startPage - 1 ||
              pageNum === endPage + 1
            ) {
              // 생략 표시
              return <span key={pageNum} className="page-ellipsis">...</span>;
            }
            return null;
          })}

          {/* 다음 페이지 버튼 */}
          <button
            className="page-btn"
            onClick={handleNextPage}
            disabled={currentPage >= pageInfo.totalPages - 1}
          >
            다음
          </button>
        </div>
      )}

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
