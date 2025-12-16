import axios from "axios";
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import noImage from "../assets/images/default_book_cover.jpg";

/* ---------- Info row component ---------- */
const InfoRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 py-2">
    <div className="w-full sm:w-40 text-sm text-indigo-600 font-medium">
      {label}
    </div>
    <div className="text-gray-700 text-sm">{children}</div>
  </div>
);

/* ---------- Placeholder book (fallback) ---------- */
const PLACEHOLDER_BOOK = {
  title: "Book not found",
  author: "Unknown author",
  language: "—",
  pageNumbers: "—",
  genres: ["Unknown"],
  summary:
    "This book could not be found. It may have been deleted or the link is incorrect.",
  isbn: "—",
  publishedYear: "—",
  coverImageUrl: noImage,
  rating: 0,
  status: "want-to-read",
  dateAdded: null,
};

/* ---------- Star rating ---------- */
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

/* ---------- Main component ---------- */
export default function BookInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Fetch book ---------- */
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

  /* ---------- Delete book ---------- */
  const handleDelete = async () => {
    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <span className="text-sm text-gray-700 mb-2 sm:mb-0">
            Are you sure you want to delete this book?
          </span>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setDeleting(true);
                  await axios.delete(`/api/book/${id}`);
                  toast.success("Book deleted successfully!");
                  navigate("/books");
                } catch {
                  toast.error("Failed to delete the book.");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-violet-600 font-medium animate-pulse">
          Loading book details...
        </div>
      </div>
    );
  }

  /* ---------- Destructure safely ---------- */
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
    ? new Date(dateAdded).toLocaleDateString("en-US")
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
              <h1 className="text-2xl font-bold text-violet-600">{title}</h1>
              <p className="text-sm text-gray-500">by {author}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/books/${id}/edit`}
              className="px-4 py-2 bg-white border text-indigo-600 rounded shadow-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-50 text-red-600 border rounded shadow-sm disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
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
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                  {status === "reading"
                    ? "Reading"
                    : status === "completed"
                    ? "Completed"
                    : "Want to Read"}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500">Added on</div>
                <div className="text-sm text-gray-700">{formattedDate}</div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <Stars value={rating ?? 0} />

              <div className="border-t border-b py-4 my-4">
                <InfoRow label="Author">{author}</InfoRow>
                <InfoRow label="Language">{language}</InfoRow>
                <InfoRow label="Pages">
                  {pageNumbers ? `${pageNumbers} pages` : "—"}
                </InfoRow>
                <InfoRow label="Year">{publishedYear}</InfoRow>
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

              <h3 className="text-sm text-violet-600 font-medium mb-2">Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {summary || "No summary available."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="px-4 py-2 text-sm bg-white border rounded shadow-sm text-indigo-600"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
