import axios from "axios";

export const api = axios.create({
  baseURL: "SEU_BACKEND_URL",
});

const token = localStorage.getItem("token");

if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}
