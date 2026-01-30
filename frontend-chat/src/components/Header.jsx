import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <button onClick={logout}>Sair</button>
      </nav>
    </header>
  );
}

export default Header;
