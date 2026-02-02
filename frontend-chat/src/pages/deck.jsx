import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFlashcardsByDeck,
  createFlashcard,
  deleteFlashcard,
  updateFlashcard
} from "../services/flashcards";

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
    await updateFlashcard(deckId, editingCard.id, {
      front,
      back
    });

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
        await updateFlashcard(deckId, editingId, {
          front,
          back
        });
        setEditingId(null);
      } else {
        await createFlashcard(deckId, {
          front,
          back
        });
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

  function handleEdit(card) {
    setEditingId(card.id);
    setFront(card.front);
    setBack(card.back);
  }

  useEffect(() => {
    loadFlashcards();
  }, []);

  return (
    <div className="container">
      <button onClick={() => navigate(`/decks/${deckId}/study`)}>
          Começar a estudar</button>

      <h1>Flashcards</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Frente"
          value={front}
          onChange={e => setFront(e.target.value)}
        />

        <input
          placeholder="Verso"
          value={back}
          onChange={e => setBack(e.target.value)}
        />

        <button type="submit">
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
          >
            Cancelar
          </button>
        )}
      </form>

      <ul>
      {flashcards.map((card, index) => (
        <li key={card.id}>
          <span>Flashcard {index + 1}</span>{" "}<br />
          <strong>{card.front}</strong>
          <br />
          <span>{card.back}</span>

          <br />

          <button onClick={() => openEditModal(card)}>
            Editar
          </button>

          <button onClick={() => handleDelete(card.id)}>
            Deletar
          </button>
        </li>
      ))}
    </ul>


      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar flashcard</h3>

            <form onSubmit={handleUpdate}>
              <input
                value={front}
                onChange={e => setFront(e.target.value)}
              />

              <input
                value={back}
                onChange={e => setBack(e.target.value)}
              />

              <button type="submit">Salvar</button>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
