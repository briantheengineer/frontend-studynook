import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyDecks, createDeck, deleteDeck } from "../services/decks";

function Dashboard() {
  const { loading } = useAuth();

  const [decks, setDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [newDeckName, setNewDeckName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (loading) return;

    async function loadDecks() {
      try {
        const data = await getMyDecks();
        setDecks(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setDecks([]);
        } else {
          alert("Erro ao carregar decks");
        }
      } finally {
        setLoadingDecks(false);
      }
    }

    loadDecks();
  }, [loading]);

  async function handleCreateDeck(e) {
    e.preventDefault();

    if (!newDeckName.trim()) {
      alert("Digite um nome para o deck");
      return;
    }

    try {
      setCreating(true);
      const deck = await createDeck(newDeckName);
      setDecks(prev => [...prev, deck]);
      setNewDeckName("");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao criar deck");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteDeck(id) {
    if (!confirm("Tem certeza que deseja deletar esse deck?")) return;

    try {
      await deleteDeck(id);
      setDecks(prev => prev.filter(deck => deck.id !== id));
    } catch {
      alert("Erro ao deletar deck");
    }
  }

  if (loading || loadingDecks) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Meus Decks</h1>

      <form onSubmit={handleCreateDeck}>
        <input
          type="text"
          placeholder="Nome do novo deck"
          value={newDeckName}
          onChange={e => setNewDeckName(e.target.value)}
        />
        <button type="submit" disabled={creating}>
          {creating ? "Criando..." : "Criar deck"}
        </button>
      </form>

      <hr />

      {decks.length === 0 && <p>Nenhum deck criado ainda</p>}

      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <Link to={`/decks/${deck.id}`}>
              <strong>{deck.name}</strong>
            </Link>{" "}
            <button onClick={() => handleDeleteDeck(deck.id)}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
