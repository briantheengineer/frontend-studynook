import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import Deck from "./pages/deck";
import Flashcards from "./pages/Flashcards";
import Study from "./pages/Study";


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/decks/:deckId" element={<Deck />} />
        <Route path="/decks/:deckId/flashcards" element={<Flashcards />}/>
        <Route path="/decks/:deckId/study" element={<Study />}


/>


</Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
