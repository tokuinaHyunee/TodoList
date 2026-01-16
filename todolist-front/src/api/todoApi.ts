import api from "./axios";

// 할일 타입
export interface Todo {
  id: number;
  title: string;
  checked: boolean;
  createdAt: string;
  user: { username: string };
}

// 세부 할일 타입
export interface SubTodo {
  id: number;
  title: string;
  checked: boolean;
  createdAt: string;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[]; // 실제 데이터 목록
  totalElements: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지 크기
  number: number; // 현재 페이지 번호 (0부터 시작)
  first: boolean; // 첫 페이지 여부
  last: boolean; // 마지막 페이지 여부
  numberOfElements: number; // 현재 페이지의 항목 수
}

// 페이징 파라미터 타입
export interface PageParams {
  page?: number; // 페이지 번호 (0부터 시작, 기본값: 0)
  size?: number; // 페이지 크기 (기본값: 10)
}

/**
 * 모든 Todo 조회 (페이징 지원)
 * @param params 페이징 파라미터 (page, size)
 * @returns 페이징된 Todo 목록
 */
export const getTodos = (params?: PageParams) =>
  api.get<PageResponse<Todo>>("/todos", { params });

/**
 * 내가 작성한 Todo 조회 (페이징 지원)
 * @param params 페이징 파라미터 (page, size)
 * @returns 페이징된 Todo 목록
 */
export const getMyTodos = (params?: PageParams) =>
  api.get<PageResponse<Todo>>("/todos/my", { params });
export const createTodo = (title: string) =>
  api.post("/todos", { title });
export const updateTodo = (id: number, title: string) =>
  api.patch(`/todos/${id}`, { title });
export const deleteTodo = (id: number) =>
  api.delete(`/todos/${id}`);
export const toggleTodoCheck = (id: number) =>
  api.patch(`/todos/${id}/check`, {});

export const getSubTodos = (todoId: number) =>
  api.get<SubTodo[]>(`/subtodos/${todoId}`);

export const createSubTodo = (todoId: number, title: string) =>
  api.post(`/subtodos/${todoId}`, { title });

export const toggleSubTodoCheck = (subTodoId: number) =>
  api.patch(`/subtodos/${subTodoId}/check`);

export const updateSubTodo = (id: number, title: string) =>
  api.patch(`/subtodos/${id}`, { title });

export const deleteSubTodo = (subTodoId: number) =>
  api.delete(`/subtodos/${subTodoId}`);

// 인증 API
export interface User {
  id: number;
  username: string;
}

export const getCurrentUser = () => api.get<User>("/auth/me");
export const logout = () => api.post("/auth/logout");

// 인증 관련 API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface CheckUsernameResponse {
  exists: boolean;
}

export const login = (username: string, password: string) =>
  api.post("/auth/login", { username, password } as LoginRequest);

export const register = (username: string, password: string) =>
  api.post("/auth/register", { username, password } as RegisterRequest);

export const checkUsername = (username: string) =>
  api.get<CheckUsernameResponse>("/auth/check-username", {
    params: { username },
  });