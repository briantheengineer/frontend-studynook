import { api } from "./api";

export async function getMyFlashcards() {
  const res = await api.get("/flashcards"); 
  return res.data;
}

export async function createFlashcard(data) {
  const res = await api.post("/flashcards", data);
  return res.data;
}

export async function updateFlashcard(id, data) {
  const res = await api.put(`/flashcards/${id}`, data);
  return res.data;
}

export async function deleteFlashcard(id) {
  const res = await api.delete(`/flashcards/${id}`);
  return res.data;
}
