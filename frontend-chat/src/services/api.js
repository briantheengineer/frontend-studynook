import axios from "axios";

export const API_URL = "https://backend-chat-production-9657.up.railway.app";

export const api = axios.create({
  baseURL: API_URL,
});