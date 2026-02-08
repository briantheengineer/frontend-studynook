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

  if (loading || loadingDecks) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8">Meus Decks</h1>

        <form
          onSubmit={handleCreateDeck}
          className="bg-slate-900 border border-border rounded-2xl p-4 sm:p-6 mb-10 flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Nome do novo deck"
            value={newDeckName}
            onChange={e => setNewDeckName(e.target.value)}
            className="flex-1 bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={creating}
            className="bg-primary hover:bg-primaryHover disabled:opacity-50 px-6 py-3 rounded-xl font-medium transition"
          >
            {creating ? "Criando..." : "Criar deck"}
          </button>
        </form>

        {decks.length === 0 && (
          <div className="bg-slate-900 border border-border rounded-2xl p-10 text-center">
            <p className="text-slate-400">
              Nenhum deck criado ainda.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map(deck => (
            <div
              key={deck.id}
              className="bg-slate-900 border border-border rounded-2xl p-6 hover:border-primary transition group"
            >
              <Link to={`/decks/${deck.id}`}>
                <h2 className="text-xl font-semibold group-hover:text-primary transition">
                  {deck.name}
                </h2>
              </Link>

              <button
                onClick={() => handleDeleteDeck(deck.id)}
                className="mt-4 text-sm text-red-400 hover:text-red-300 transition"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
