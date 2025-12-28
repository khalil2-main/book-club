import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import noImage from "../assets/images/default_book_cover.jpg";
import { useAuth } from "../context/AuthContext";

/* ---------- Info row component ---------- */
const InfoRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 py-2">
    <div className="w-full sm:w-40 text-sm text-indigo-600 font-medium">
      {label}
    </div>
    <div className="text-gray-700 text-sm">{children}</div>
  </div>
);

/* ---------- Placeholder book ---------- */
const PLACEHOLDER_BOOK = {
  title: "Book not found",
  author: "Unknown author",
  language: "—",
  pageNumbers: "—",
  genres: ["Unknown"],
  summary: "This book could not be found.",
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
          className={`text-lg ${
            i < full ? "text-yellow-500" : "text-gray-300"
          }`}
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
  const { admin } = useAuth();

  const [book, setBook] = useState(null);
  const [preview, setPreview] = useState(noImage);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editor, setEditor] = useState(false);

  // user book states
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReading, setIsReading] = useState(false);

  /* ---------- Check editor ---------- */
  const checkEditor = async (id) => {
    const res = await axios.get(`/api/isEditor/${id}`);
    setEditor(res.data.editor);
  };

  /* ---------- Fetch user book status ---------- */
  const fetchUserBookStatus = async () => {
    try {
      const res = await axios.get(`/api/user/book-status/${id}`);
      setIsFavorite(res.data.favorite);
      setIsReading(res.data.currentlyReading);
    } catch {
      // book not in user's list yet
    }
  };

  /* ---------- Fetch book ---------- */
  useEffect(() => {
    const ac = new AbortController();

    const getBook = async () => {
      try {
        const res = await axios.get(`/api/book/${id}`, {
          signal: ac.signal,
        });

        setBook(res.data.book || PLACEHOLDER_BOOK);
        if (res.data.book?.coverImageUrl) {
          setPreview(res.data.book.coverImageUrl);
        }

        await checkEditor(res.data.book.createdBy);
        await fetchUserBookStatus();
      } catch (err) {
        if (!axios.isCancel(err)) {
          setBook(PLACEHOLDER_BOOK);
        }
      } finally {
        setLoading(false);
      }
    };

    getBook();
    return () => ac.abort();
  }, [id]);

  /* ---------- Toggle favorite ---------- */
  const toggleFavorite = async () => {
    try {
      await axios.patch(`/api/user/addFav/${id}`);
      setIsFavorite((prev) => !prev);
      toast.success(
        !isFavorite ? "Added to favorites ❤️" : "Removed from favorites 💔"
      );
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  /* ---------- Toggle reading ---------- */
  const toggleReading = async () => {
    try {
      await axios.patch(`/api/user/addtoreading/${id}`);
      setIsReading((prev) => !prev);
      toast.success(
        !isReading ? "Marked as reading 📖" : "Reading stopped"
      );
    } catch {
      toast.error("Failed to update reading status");
    }
  };

  /* ---------- Delete book ---------- */
  const handleDelete = async () => {
    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <span className="text-sm text-gray-700">
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
              className="px-3 py-1 bg-gray-300 rounded text-sm"
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-violet-600 animate-pulse">
          Loading book details...
        </div>
      </div>
    );
  }

  const {
    title,
    author,
    language,
    pageNumbers,
    genres,
    summary,
    isbn,
    publishedYear,
    rating,
   
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
              className="p-2 rounded-full bg-white shadow text-indigo-600"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-violet-600">{title}</h1>
              <p className="text-sm text-gray-500">by {author}</p>
            </div>
          </div>

          {(admin || editor) && (
            <div className="flex space-x-3">
              <Link
                to={`/books/${id}/edit`}
                className="px-4 py-2 bg-white border text-indigo-600 rounded"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-50 text-red-600 border rounded"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6">
          
            {/* Cover */}
            <div className="flex flex-col items-center">
              {/* Image */}
              <div className="w-56 h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt={title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              {/* ACTION BUTTONS (same row) */}
              <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs">
                <button
                  onClick={toggleFavorite}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                    ${isFavorite
                      ? "bg-pink-100 text-pink-600 border-pink-200"
                      : "bg-white text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  {isFavorite ? "★ Favorited" : "☆ Favorite"}
                </button>

                <button
                  onClick={toggleReading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                    ${isReading
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-white text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  {isReading ? "📖 Reading" : "▶ Read"}
                </button>
              </div>

              {/* Date */}
              <div className="mt-3 text-xs text-gray-500">
                Added on: {formattedDate}
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

              <h3 className="text-sm text-violet-600 font-medium mb-2">
                Summary
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {summary || "No summary available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
