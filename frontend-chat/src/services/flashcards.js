import { api } from "./api";

export async function getFlashcardsByDeck(deckId) {
  const res = await api.get(`/decks/${deckId}/flashcards`);
  return res.data;
}
