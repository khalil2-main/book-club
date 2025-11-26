import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/book", { withCredentials: true });
        if (mounted) setBooks(res.data);
      } catch {
        // fallback: RecentBooks had static data, re-use a small fallback
        setError("Impossible de charger les livres. Affichage des exemples.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => (mounted = false);
  }, []);

  const staticBooks = [
    { _id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', description: 'Un conte poétique et philosophique.', createdAt: new Date('2025-11-01') },
    { _id: '2', title: 'L’Étranger', author: 'Albert Camus', description: 'Un roman sur l’absurdité de la vie.', createdAt: new Date('2025-11-10') },
    { _id: '3', title: '1984', author: 'George Orwell', description: 'Un classique de la dystopie politique.', createdAt: new Date('2025-11-20') }
  ];

  const displayBooks = books.length > 0 ? books : staticBooks;

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-11/12 md:w-9/12 mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Tous les livres</h1>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              {error && <div className="text-orange-600 text-center mb-4">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBooks.map(book => (
                  <div key={book._id} onClick={() => navigate(`/books/${book._id}`)} role="button" tabIndex={0} className="bg-white rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition cursor-pointer">
                    <div className="font-semibold text-lg mb-2">{book.title}</div>
                    <div className="text-sm text-gray-600 mb-1">{book.author}</div>
                    <div className="text-xs text-gray-400 mb-2">Ajouté le {new Date(book.createdAt).toLocaleDateString()}</div>
                    <div className="text-gray-700 truncate">{book.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default AllBooks;
