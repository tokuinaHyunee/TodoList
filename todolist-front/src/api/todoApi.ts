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

export const getTodos = () => api.get<Todo[]>("/todos");
export const getMyTodos = () => api.get<Todo[]>("/todos/my");
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