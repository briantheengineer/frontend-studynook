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
    <div className="min-h-screen bg-background text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Flashcards</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-slate-900 border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Adicionar flashcard
          </h2>

          <form
            onSubmit={handleCreateFlashcard}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input
              placeholder="Pergunta"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              placeholder="Resposta"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="sm:col-span-2 bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl font-medium transition"
            >
              Adicionar flashcard
            </button>
          </form>
        </div>

        {flashcards.length === 0 ? (
          <div className="bg-slate-900 border border-border rounded-2xl p-10 text-center text-slate-400">
            Nenhum flashcard criado ainda.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {flashcards.map((card, index) => (
              <div
                key={card.id}
                className="bg-slate-900 border border-border rounded-2xl p-6 space-y-3"
              >
                <span className="text-sm text-slate-400">
                  {index + 1}.
                </span>

                <p className="font-semibold">
                  {card.front || card.question}
                </p>

                <p className="text-slate-400">
                  {card.back || card.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
