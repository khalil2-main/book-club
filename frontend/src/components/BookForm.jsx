/* Revised BookForm with Summary field moved to the end */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function BookForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    pageNumbers: "",
    genres: "",
    summary: "",
    isbn: "",
    publishedYear: "",
    coverImageUrl: "",
    rating: "",
    status: "reading",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm({ ...form, coverImageUrl: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        pageNumbers: Number(form.pageNumbers),
        rating: Number(form.rating),
        genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
      };

      await axios.post("/api/book", payload, { withCredentials: true });
      navigate("/books");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="w-4/5 mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-6">Add a New Book</h2>

        {/* Cover image upload area */}
        <div className="mb-6 flex flex-col ">
          <label htmlFor="coverUpload" className="cursor-pointer">
            {preview || form.coverImageUrl ? (
              <img
                src={preview || form.coverImageUrl}
                alt="Cover Preview"
                className="w-40 h-56 object-cover rounded shadow"
              />
            ) : (
              <div className="w-40 h-56 flex items-center justify-center bg-gray-200 rounded text-gray-500">
                Upload Cover
              </div>
            )}
          </label>
          <input
            id="coverUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Smaller width fields */}
          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">Author *</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">Language</label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">Pages</label>
            <input
              type="number"
              name="pageNumbers"
              value={form.pageNumbers}
              onChange={handleChange}
              className="border p-2 rounded"
              min="1"
            />
          </div>

          {/* Full-width fields */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium mb-1">Genres (comma separated) *</label>
            <input
              name="genres"
              value={form.genres}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="e.g. Fantasy, Adventure"
            />
          </div>

          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="10 or 13 digits"
            />
          </div>

          <div className="flex flex-col md:col-span-1">
            <label className="font-medium mb-1">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={form.publishedYear}
              onChange={handleChange}
              className="border p-2 rounded"
              min="1900"
            />
          </div>

          {/* Summary moved to the end */}
          <div className="flex flex-col md:col-span-4">
            <label className="font-medium mb-1">Summary</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="border p-2 rounded h-28"
            />
          </div>

          {error && (
            <p className="text-red-600 md:col-span-4">{error}</p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 md:col-span-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}
