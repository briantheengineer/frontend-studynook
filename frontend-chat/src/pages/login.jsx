import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginRequest } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await loginRequest(email, password);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.error || "Erro ao fazer login";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-border rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-slate-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover py-3 rounded-xl font-medium transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Não tem cadastro?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline"
          >
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
