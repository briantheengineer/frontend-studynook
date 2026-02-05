import { api } from "./api";

export async function getMyDecks() {
  const res = await api.get("/decks");
  return res.data;
}

export async function createDeck(name) {
  const res = await api.post("/decks", { name });
  return res.data;
}

export async function deleteDeck(id) {
  const res = await api.delete(`/decks/${id}`);
  return res.data;
}

export async function getDeck(id) {
  const res = await api.get(`/decks/${id}`);
  return res.data;
}
