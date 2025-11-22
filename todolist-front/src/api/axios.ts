import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // 쿠키를 포함하여 요청
});

export default api;
