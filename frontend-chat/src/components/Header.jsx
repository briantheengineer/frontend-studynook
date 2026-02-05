import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { logout } = useAuth();

  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        
        <Link
          to="/dashboard"
          className="text-lg font-semibold text-white hover:text-primary transition"
        >
          Flashcards
        </Link>

        <button
          onClick={logout}
          className="text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition"
        >
          Sair
        </button>

      </nav>
    </header>
  );
}

export default Header;
