import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFlashcardsByDeck,
  createFlashcard,
  deleteFlashcard,
  updateFlashcard
} from "../services/flashcards";
import { getDeck } from "../services/decks";


export default function Deck() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deck, setDeck] = useState(null);


  async function loadFlashcards() {
    try {
      const data = await getFlashcardsByDeck(deckId);
      setFlashcards(data);
    } catch {
      setError("Erro ao carregar flashcards");
    }
  }

  function openEditModal(card) {
    setEditingCard(card);
    setFront(card.front);
    setBack(card.back);
    setIsEditOpen(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      await updateFlashcard(deckId, editingCard.id, { front, back });
      setIsEditOpen(false);
      setEditingCard(null);
      setFront("");
      setBack("");
      loadFlashcards();
    } catch {
      setError("Erro ao editar flashcard");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!front || !back) {
      setError("Preencha frente e verso");
      return;
    }

    try {
      if (editingId) {
        await updateFlashcard(deckId, editingId, { front, back });
        setEditingId(null);
      } else {
        await createFlashcard(deckId, { front, back });
      }

      setFront("");
      setBack("");
      loadFlashcards();
    } catch {
      setError("Erro ao salvar flashcard");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFlashcard(deckId, id);
      loadFlashcards();
    } catch {
      setError("Erro ao deletar flashcard");
    }
  }

 useEffect(() => {
  loadFlashcards();
  getDeck(deckId).then(setDeck);
}, []);



  return (
    <div className="min-h-screen bg-background text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">
            {deck ? deck.name : "Carregando..."}
          </h1>


          <button
            onClick={() => navigate(`/decks/${deckId}/study`)}
            className="bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl font-medium transition"
          >
            Começar a estudar
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-border rounded-2xl p-4 sm:p-6 grid gap-4 sm:grid-cols-2"
        >
          <input
            placeholder="Frente"
            value={front}
            onChange={e => setFront(e.target.value)}
            className="bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            placeholder="Verso"
            value={back}
            onChange={e => setBack(e.target.value)}
            className="bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl font-medium transition"
            >
              {editingId ? "Salvar edição" : "Criar flashcard"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFront("");
                  setBack("");
                }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flashcards.map((card, index) => (
            <div
              key={card.id}
              className="bg-slate-900 border border-border rounded-2xl p-6 space-y-4"
            >
              <span className="text-sm text-slate-400">
                Flashcard {index + 1}
              </span>

              <div>
                <p className="font-semibold">{card.front}</p>
                <p className="text-slate-400 mt-1">{card.back}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => openEditModal(card)}
                  className="text-sm text-primary hover:underline"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(card.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-slate-900 border border-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold">Editar flashcard</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                value={front}
                onChange={e => setFront(e.target.value)}
                className="w-full bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                value={back}
                onChange={e => setBack(e.target.value)}
                className="w-full bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl font-medium transition"
                >
                  Salvar
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
