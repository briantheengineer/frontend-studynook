import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    setLoading(false); // terminou de checar token
  }, []);

  async function loginRequest(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginRequest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
