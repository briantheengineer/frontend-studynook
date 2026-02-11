import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function loginRequest(email, password) {
    const response = await api.post("/auth/login", { email, password });

    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setIsAuthenticated(true);
  }

  async function registerRequest(name, email, password) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const token = response.data.token;
    
    console.log("REGISTER RESPONSE:", response.data);

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
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginRequest,
        registerRequest,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
