import axios from "axios";

export const api = axios.create({
  baseURL: "backend-chat-production-9657.up.railway.app",
});

const token = localStorage.getItem("token");

if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}
