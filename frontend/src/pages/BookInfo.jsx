import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Component for displaying a row of info
const InfoRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 py-2">
    <div className="w-full sm:w-40 text-sm text-indigo-600 font-medium">
      {label}
    </div>
    <div className="text-gray-700 text-sm">{children}</div>
  </div>
);

// Placeholder book in case API fails
const PLACEHOLDER_BOOK = {
  title: "Livre introuvable",
  author: "Auteur inconnu",
  language: "—",
  pageNumbers: "—",
  genres: ["Inconnu"],
  summary:
    "Ce livre est introuvable. Il a peut-être été supprimé ou le lien est incorrect.",
  isbn: "—",
  publishedYear: "—",
  coverImageUrl: "https://via.placeholder.com/300x450?text=Aucune+Couverture",
  rating: 0,
  status: "want-to-read",
  dateAdded: null,
};

// Star rating component
const Stars = ({ value = 0 }) => {
  const full = Math.floor(value);
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < full ? "text-yellow-500" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-2">
        ({value?.toFixed(1) ?? "0.0"})
      </span>
    </div>
  );
};

export default function BookInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const ac = new AbortController();

    const getBook = async () => {
      try {
        const res = await axios.get(`/api/book/${id}`, { signal: ac.signal });
        setBook(res.data.book || PLACEHOLDER_BOOK);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setBook(PLACEHOLDER_BOOK);
      } finally {
        setLoading(false);
      }
    };

    getBook();

    return () => ac.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/book/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      navigate("/");
    } catch {
      alert("Échec de la suppression du livre.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-indigo-600 font-medium animate-pulse">
          Chargement des détails du livre...
        </div>
      </div>
    );
  }

  // Destructure book object safely
  const {
    title,
    author,
    language,
    pageNumbers,
    genres,
    summary,
    isbn,
    publishedYear,
    coverImageUrl,
    rating,
    status,
    dateAdded,
  } = book || PLACEHOLDER_BOOK;

  const formattedDate = dateAdded
    ? new Date(dateAdded).toLocaleDateString("fr-FR")
    : "—";

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white shadow text-indigo-600 hover:shadow-md"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">{title}</h1>
              <p className="text-sm text-gray-500">par {author}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/books/${id}/edit`}
              className="px-4 py-2 bg-white border text-indigo-600 rounded shadow-sm"
            >
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-50 text-red-600 border rounded shadow-sm disabled:opacity-50"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-56 h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={coverImageUrl}
                  alt={title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500">Statut</div>
                <div className="mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                  {status === "reading"
                    ? "En cours"
                    : status === "completed"
                    ? "Terminé"
                    : "À lire"}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500">Ajouté le</div>
                <div className="text-sm text-gray-700">{formattedDate}</div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <Stars value={rating ?? 0} />

              <div className="border-t border-b py-4 my-4">
                <InfoRow label="Auteur">{author}</InfoRow>
                <InfoRow label="Langue">{language}</InfoRow>
                <InfoRow label="Pages">
                  {pageNumbers ? `${pageNumbers} pages` : "—"}
                </InfoRow>
                <InfoRow label="Année">{publishedYear}</InfoRow>
                <InfoRow label="ISBN">{isbn}</InfoRow>
                <InfoRow label="Genres">
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g, i) => (
                      <span
                        key={i}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </InfoRow>
              </div>

              <h3 className="text-sm text-indigo-600 font-medium mb-2">
                Résumé
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {summary || "Aucun résumé disponible."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="px-4 py-2 text-sm bg-white border rounded shadow-sm text-indigo-600"
            >
              ← Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
