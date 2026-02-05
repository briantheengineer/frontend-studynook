import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlashcardsByDeck } from "../services/flashcards";

export default function Study() {
  const { deckId } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    getFlashcardsByDeck(deckId).then(setFlashcards);
  }, [deckId]);

  useEffect(() => {
    if (showAnswer) return;

    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showAnswer]);

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Sem flashcards</p>
      </div>
    );
  }

  const card = flashcards[index];

  function nextCard() {
    setShowAnswer(false);
    setSeconds(0);
    setIndex(i => (i + 1) % flashcards.length);
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <Link
          to={`/decks/${deckId}`}
          className="inline-block mb-4 text-indigo-600 font-medium hover:underline"
        >
          Voltar ao deck
        </Link>

        <h2 className="text-2xl font-bold text-center mb-2">
          Modo Estudo
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Tempo: {seconds}s
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 min-h-[200px] flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-center">
            {card.front}
          </h3>

          {showAnswer && (
            <p className="mt-4 text-center text-gray-700">
              {card.back}
            </p>
          )}
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Mostrar resposta
          </button>
        ) : (
          <button
            onClick={nextCard}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Próximo
          </button>
        )}
      </div>
    </div>
  );
}
