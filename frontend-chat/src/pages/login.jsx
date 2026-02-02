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
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Não tem cadastro? <Link to="/register"> Registre-se</Link></p>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
