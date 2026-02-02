import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFlashcardsByDeck,
  createFlashcard
} from "../services/flashcards";

export default function Deck() {
  const { deckId } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  async function loadFlashcards() {
    try {
      const data = await getFlashcardsByDeck(deckId);
      setFlashcards(data);
    } catch {
      setError("Erro ao carregar flashcards");
    }
  }

  async function handleCreateFlashcard(e) {
    e.preventDefault();
    setError("");

    try {
      await createFlashcard(deckId, {
        question,
        answer
      });

      setQuestion("");
      setAnswer("");
      loadFlashcards();
    } catch {
      setError("Erro ao criar flashcard");
    }
  }

  useEffect(() => {
    loadFlashcards();
  }, []);

  return (
    <div className="container">
      <h1>Flashcards</h1>

      {error && <p>{error}</p>}

      <ul>
        {flashcards.map((card, index) => (
            <li key={card.id}>
            <strong>{index + 1}.</strong> {card.front}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreateFlashcard}>
        <input
          placeholder="Pergunta"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />

        <input
          placeholder="Resposta"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />

        <button type="submit">
          Adicionar flashcard
        </button>
      </form>
    </div>
  );
}
