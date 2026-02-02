import { useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Registro sucesso:", response.data);
    } catch (err) {
        const message =
          err.response?.data?.error || "Erro ao registrar";
        setError(message);
}

  }

  return (
    <>
    <div className="container">
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Cadastrar</button>
    </form>
    </div>
    <div>
      <p>Já tem uma conta? <Link to="/login">Faça login aqui!</Link></p>
    </div>
    </>
  );
}

export default Register;
