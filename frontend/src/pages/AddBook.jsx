import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Header from "../components/Header";

const AddBook = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/book", { withCredentials: true });
        if (mounted) setBooks(res.data);
      } catch (err) {
        console.log(err)
      } finally {
        if (mounted) setLoadingBooks(false);
      }
    };
    fetchBooks();
    return () => (mounted = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "/api/book",
        { title: title.trim(), description: description.trim() },
        { withCredentials: true }
      );
      navigate("/books");
    } catch (err) {
      console.error("Add book failed:", err);
      setError(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const staticBooks = [
    { _id: "1", title: "There and Back Again", author: "Frodo Baggins", description: "A classic adventure.", createdAt: new Date() },
    { _id: "2", title: "The Lord of the Rings", author: "Bilbo Baggins", description: "Epic fantasy.", createdAt: new Date() }
  ];

  const displayBooks = books.length > 0 ? books : staticBooks;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-11/12 md:w-10/12 mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Add form */}
              <section className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Welcome,</h2>
                <p className="text-sm text-gray-600 mb-4">Add a New Book</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Description"
                      rows={4}
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Right: All Books list */}
              <aside className="md:w-1/2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">All Books</h3>
                  <span className="text-sm text-gray-500">{displayBooks.length} items</span>
                </div>

                <div className="space-y-3">
                  {loadingBooks ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                  ) : (
                    displayBooks.map((b) => (
                      <div key={b._id} className="bg-gray-100 rounded-lg p-3">
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-gray-500">Added by {b.author || 'Unknown'}</div>
                        <div className="text-sm text-gray-700 mt-1">{b.description}</div>
                      </div>
                    ))
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddBook;
