import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlashcardsByDeck } from "../services/flashcards";

export default function Study() {
  const { deckId } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showAnswer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        Carregando flashcards...
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        Sem flashcards neste deck.
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
    <div className="min-h-screen bg-background text-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        <Link
          to={`/decks/${deckId}`}
          className="inline-block mb-6 text-primary hover:underline"
        >
          ← Voltar ao deck
        </Link>

        <h2 className="text-3xl font-bold text-center mb-2">
          Modo Estudo
        </h2>

        <p className="text-center text-sm text-slate-400 mb-8">
          Tempo nesta carta: <span className="text-primary font-semibold">{seconds}s</span>
        </p>

        <div className="bg-slate-900 border border-border rounded-2xl shadow-xl p-8 mb-6 min-h-[350px] flex flex-col justify-center transition-all">

          <h3 className="text-2xl font-semibold text-center break-words">
            {card.front}
          </h3>

          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt="Flashcard"
              className="w-full max-h-[320px] object-contain rounded-xl mt-6"
              loading="lazy"
            />
          )}

          {showAnswer && (
            <p className="mt-6 text-center text-slate-300 text-lg break-words">
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
          <button
            onClick={nextCard}
            className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-semibold text-lg transition"
          >
            Próximo flashcard
          </button>
        )}

        <p className="text-center text-xs text-slate-500 mt-4">
          Cartão {index + 1} de {flashcards.length}
        </p>
      </div>
    </div>
  );
}