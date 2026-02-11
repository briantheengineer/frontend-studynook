import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { registerRequest } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await registerRequest(name, email, password);
      navigate("/dashboard", { replace: true });

    } catch {
      alert("Erro ao criar conta");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl w-96">
        <h1 className="text-white text-2xl mb-6">Criar conta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button className="w-full bg-indigo-600 p-3 rounded text-white">
            Criar conta
          </button>
        </form>

        <p className="text-slate-400 mt-4">
          Já tem conta? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
