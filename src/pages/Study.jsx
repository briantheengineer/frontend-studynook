import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlashcardsByDeck, reviewFlashcard } from "../services/flashcards";

export default function Study() {
  const { deckId } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFlashcardsByDeck(deckId);
        setFlashcards(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [deckId]);

  useEffect(() => {
    if (showAnswer) return;

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showAnswer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        Carregando sessão de estudo...
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        Nenhum flashcard disponível para estudar.
      </div>
    );
  }

  const card = flashcards[index];

  async function handleReview(quality) {
    if (reviewing) return;

    try {
      setReviewing(true);

      await reviewFlashcard(card.id, quality);

      setShowAnswer(false);
      setSeconds(0);

      setIndex((i) => (i + 1) % flashcards.length);
    } finally {
      setReviewing(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <Link
          to={`/decks/${deckId}`}
          className="text-primary hover:underline"
        >
          ← Voltar ao deck
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Modo Estudo</h1>
          <p className="text-slate-400 mt-2">
            Tempo pensando: {seconds}s
          </p>
        </div>

        <div className="bg-slate-900 border border-border rounded-2xl p-8 min-h-[280px] flex flex-col justify-center shadow-lg">
          <h2 className="text-xl font-semibold text-center">
            {card.front}
          </h2>

          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt="flashcard"
              className="mt-6 max-h-[260px] object-contain rounded-xl"
              loading="lazy"
            />
          )}

          {showAnswer && (
            <p className="mt-6 text-center text-slate-300 text-lg">
              {card.back}
            </p>
          )}
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full bg-primary hover:bg-primaryHover py-4 rounded-xl font-semibold text-lg transition"
          >
            Mostrar resposta
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              disabled={reviewing}
              onClick={() => handleReview(0)}
              className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition"
            >
              Errei
            </button>

            <button
              disabled={reviewing}
              onClick={() => handleReview(3)}
              className="bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition"
            >
              Difícil
            </button>

            <button
              disabled={reviewing}
              onClick={() => handleReview(4)}
              className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
            >
              Bom
            </button>

            <button
              disabled={reviewing}
              onClick={() => handleReview(5)}
              className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition"
            >
              Fácil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}