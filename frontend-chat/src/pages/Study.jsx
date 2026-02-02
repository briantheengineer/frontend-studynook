import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFlashcardsByDeck } from "../services/flashcards";
import { Link } from "react-router-dom";

export default function Study() {
  const { deckId } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    getFlashcardsByDeck(deckId).then(setFlashcards);
  }, []);

useEffect(() => {
  if (showAnswer) return;

  const timer = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [showAnswer]);

  if (flashcards.length === 0) {
    return <p>Sem flashcards</p>;
  }

  const card = flashcards[index];

  function nextCard() {
    setShowAnswer(false);
    setSeconds(0);
    setIndex(i => (i + 1) % flashcards.length);
  }

  return (
    <div className="container">
      <Link to={`/decks/${deckId}`} className="btn">Voltar ao deck</Link>
      <h2>Modo Estudo</h2>

      <p>Tempo: {seconds}s</p>

      <div className="card">
        <h3>{card.front}</h3>

        {showAnswer && (
          <p>{card.back}</p>
        )}
      </div>

      {!showAnswer ? (
        <button onClick={() => setShowAnswer(true)}>
          Mostrar resposta
        </button>
      ) : (
        <button onClick={nextCard}>
          Próximo
        </button>
      )}
    </div>
  );
}
