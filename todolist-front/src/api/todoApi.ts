import axios from "axios";

// Axios 인스턴스 설정
const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Todo 타입 정의
export interface Todo {
    id: number;
    title: string;
    checked: boolean;
    subTodos: SubTodo[];
}

export interface SubTodo {
    id: number;
    title: string;
    checked: boolean;
    todoId?: number;
}

// Todo 관련 API
export const getTodos = () => api.get<Todo[]>("/todos");
export const createTodo = (title: string) => api.post<Todo>("/todos", { title });
export const deleteTodo = (id: number) => api.delete(`/todos/${id}`);
export const toggleTodoCheck = (id: number) => api.patch<Todo>(`/todos/${id}/check`);

// SubTodo 관련 API
export const getSubTodos = (todoId: number) => api.get<SubTodo[]>(`/subtodos/${todoId}`);
export const createSubTodo = (todoId: number, title: string) =>
    api.post<SubTodo>(`/subtodos/${todoId}`, { title });
export const toggleSubTodoCheck = (id: number) => api.patch<SubTodo>(`/subtodos/${id}/check`);
export const deleteSubTodo = (id: number) => api.delete(`/subtodos/${id}`);
