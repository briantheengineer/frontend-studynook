import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getFlashcardsByDeck } from "../services/flashcards";

function Deck() {
  const { deckId } = useParams();
  const { loading } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    if (loading) return;

    async function loadFlashcards() {
      try {
        const data = await getFlashcardsByDeck(deckId);
        setFlashcards(data);
      } catch (err) {
        alert(err.response?.data?.error || "Erro ao carregar flashcards");
      } finally {
        setLoadingCards(false);
      }
    }

    loadFlashcards();
  }, [loading, deckId]);

  if (loading || loadingCards) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Flashcards do Deck</h1>

      {flashcards.length === 0 && (
        <p>Esse deck ainda não tem flashcards</p>
      )}

      <ul>
        {flashcards.map(card => (
          <li key={card.id}>
            <strong>{card.question}</strong>
            <p>{card.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Deck;
