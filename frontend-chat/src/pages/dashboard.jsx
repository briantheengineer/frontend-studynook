import { useEffect, useState } from "react";
import { getMyFlashcards, deleteFlashcard } from "../services/flashcards";

function Dashboard() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  async function loadFlashcards() {
    setLoading(true);
    try {
      const data = await getMyFlashcards();
      setFlashcards(data);
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao carregar flashcards");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja deletar este flashcard?")) return;

    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao deletar flashcard");
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Meus Flashcards</h1>
      {flashcards.length === 0 && <p>Nenhum flashcard encontrado</p>}
      <ul>
        {flashcards.map((f) => (
          <li key={f.id}>
            <strong>{f.question}</strong> - {f.answer}{" "}
            <button onClick={() => handleDelete(f.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
