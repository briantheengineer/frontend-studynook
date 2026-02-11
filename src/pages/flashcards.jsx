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

  //for the imagess
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadFlashcards() {
    try {
      const data = await getFlashcardsByDeck(deckId);
      setFlashcards(data);
    } catch {
      setError("Erro ao carregar flashcards");
    }
  }

  async function handleUpload(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url);
    } catch {
      setError("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateFlashcard(e) {
    e.preventDefault();
    setError("");

    try {
      await createFlashcard(deckId, {
        question,
        answer,
        imageUrl
      });

      setQuestion("");
      setAnswer("");
      setImage(null);
      setPreview(null);
      setImageUrl("");
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
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
                await handleUpload(file);
              }}
            />

            {preview && (
              <img
                src={preview}
                className="w-full max-h-[250px] object-cover rounded-xl"
                loading="lazy"
              />
            )}

            <input
              placeholder="Resposta"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="bg-slate-800 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              disabled={uploading}
              className="sm:col-span-2 bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {uploading ? "Enviando imagem..." : "Adicionar flashcard"}
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

                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt="flashcard"
                    className="w-full max-h-[250px] object-cover rounded-xl"
                    loading="lazy"
                  />
                )}

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
