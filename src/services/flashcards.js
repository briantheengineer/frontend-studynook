import { api } from "./api";

export async function getFlashcardsByDeck(deckId) {
  const res = await api.get(`/decks/${deckId}/flashcards`);
  return res.data;
}

export async function createFlashcard(deckId, data) {
  const res = await api.post(
    `/decks/${deckId}/flashcards`,
    {
      front: data.front,
      back: data.back,
      imageUrl: data.imageUrl || null
    }
  );
  return res.data;
}

export async function deleteFlashcard(deckId, flashcardId) {
  await api.delete(
    `/decks/${deckId}/flashcards/${flashcardId}`
  );
}

export async function updateFlashcard(deckId, flashcardId, data) {
  const res = await api.put(
    `/decks/${deckId}/flashcards/${flashcardId}`,
    {
      front: data.front,
      back: data.back,
      imageUrl: data.imageUrl || null
    }
  );
  return res.data;
}

export async function reviewFlashcard(id, quality) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/flashcards/${id}/review`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ quality }),
    }
  );

  return res.json();
}