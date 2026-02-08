import { useState } from "react";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
  e.preventDefault();
  setError(null);

  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log("Registro sucesso:", response.data);

    navigate("/dashboard");

  } catch (err) {
    const message =
      err.response?.data?.error || "Erro ao registrar";
    setError(message);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Criar conta
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
