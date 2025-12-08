import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/book", { withCredentials: true });
        const found = res.data.find(b => String(b._id) === String(id));
        if (!found) {
          setError("Livre non trouvé.");
          return;
        }
        if (mounted) {
          setBook(found);
          setTitle(found.title);
          setDescription(found.description);
        }

        // Récupérer l'utilisateur courant pour déterminer le rôle
        try {
          const me = await axios.get('/api/user/me', { withCredentials: true });
          const user = me.data;
          if (mounted) setIsCreator(String(user._id) === String(found.creator || found.userId || found.owner));
        } catch {
          // pas connecté
        }

        // essayer de récupérer la liste des favoris (si l'API existe)
        try {
          const favRes = await axios.get(`/api/book/${id}/favorites`, { withCredentials: true });
          if (mounted) setFavoritesList(favRes.data || []);
        } catch {
          // fallback: aucun favoris connu
        }
      } catch {
        setError("Impossible de charger le livre.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, [id]);

  const handleSave = async () => {
    try {
      // appeler PUT /api/book/:id si disponible
      await axios.put(`/api/book/${id}`, { title, description }, { withCredentials: true });
      setBook({ ...book, title, description });
      setEditing(false);
    } catch {
      setError("Échec de la sauvegarde (API manquante). Mise à jour locale seulement.");
      setBook({ ...book, title, description });
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce livre ?')) return;
    try {
      await axios.delete(`/api/book/${id}`, { withCredentials: true });
      navigate('/books');
    } catch {
      // si API manquante, on navigue quand même
      navigate('/books');
    }
  };

  const toggleFavorite = async () => {
    try {
      if (favorited) {
        await axios.post(`/api/book/${id}/unfavorite`, {}, { withCredentials: true });
        setFavorited(false);
      } else {
        await axios.post(`/api/book/${id}/favorite`, {}, { withCredentials: true });
        setFavorited(true);
      }
    } catch {
      // toggler localement si API absente
      setFavorited(!favorited);
    }
  };

  if (loading) return (<><Header/><div className="p-6 text-center">Chargement...</div></>);
  if (error) return (<><Header/><div className="p-6 text-center text-red-600">{error}</div></>);
  if (!book) return (<><Header/><div className="p-6 text-center">Aucun livre.</div></>);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-11/12 md:w-8/12 mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              {editing ? (
                <input className="w-full border px-3 py-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
              ) : (
                <h1 className="text-2xl font-bold">{book.title}</h1>
              )}
              <div className="text-sm text-gray-500">par {book.author || 'Inconnu'}</div>
            </div>

            <div className="flex gap-2">
              {isCreator ? (
                <>
                  {editing ? (
                    <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded">Sauvegarder</button>
                  ) : (
                    <button onClick={() => setEditing(true)} className="px-3 py-1 bg-yellow-400 text-white rounded">Modifier</button>
                  )}
                  <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                </>
              ) : (
                <>
                  <button onClick={toggleFavorite} className="px-3 py-1 bg-indigo-600 text-white rounded">{favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            {editing ? (
              <textarea className="w-full border p-2 rounded" rows={6} value={description} onChange={e => setDescription(e.target.value)} />
            ) : (
              <p className="text-gray-700">{book.description}</p>
            )}
          </div>

          {isCreator && (
            <div className="mt-6">
              <h3 className="font-semibold">Utilisateurs ayant mis ce livre en favori</h3>
              {favoritesList.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun favori connu (API non disponible).</div>
              ) : (
                <ul className="mt-2 space-y-1">
                  {favoritesList.map(u => (
                    <li key={u._id} className="text-sm">{u.name || u.username || u.email}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BookDetail;
