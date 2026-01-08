import axios from "axios";
import type { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      (error.response?.data as { error?: string })?.error ||
      error.message ||
      "오류가 발생했습니다.";

    if (error.response?.status === 401 || error.response?.status === 403) {
      // 인증 에러 처리
    }

    return Promise.reject(error);
  }
);

export default api;
