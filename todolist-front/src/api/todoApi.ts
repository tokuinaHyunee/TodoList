import api from "./axios";

// Todo 타입
export interface Todo {
  id: number;
  title: string;
  checked: boolean;
  createdAt: string;
  user: { username: string };
}

// SubTodo 타입
export interface SubTodo {
  id: number;
  title: string;
  checked: boolean;
  createdAt: string;
}

export const getTodos = () => api.get<Todo[]>("/todos");
export const createTodo = (title: string) =>
  api.post("/todos", { title });
export const deleteTodo = (id: number) =>
  api.delete(`/todos/${id}`);
export const toggleTodoCheck = (id: number) =>
  api.patch(`/todos/${id}/check`);

export const getSubTodos = (todoId: number) =>
  api.get<SubTodo[]>(`/subtodos/${todoId}`);

export const createSubTodo = (todoId: number, title: string) =>
  api.post(`/subtodos/${todoId}`, { title });

export const toggleSubTodoCheck = (subTodoId: number) =>
  api.patch(`/subtodos/${subTodoId}/check`);

export const deleteSubTodo = (subTodoId: number) =>
  api.delete(`/subtodos/${subTodoId}`);
