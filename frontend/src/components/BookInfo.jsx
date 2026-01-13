import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axiosInterceptor";
import noImage from "../assets/images/default_book_cover.jpg";
import { useAuth } from "../context/AuthContext";
import useConfirmDelete from "../Hooks/ConfirmDelete";
import { Stars } from "./Stars";
import Review from "./Review";

/* ---------- Info row component ---------- */
const InfoRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 py-2">
    <div className="w-full sm:w-40 text-sm text-indigo-600 font-medium">{label}</div>
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
  averageRating: 0,
  reviews: [],
 
  status: "want-to-read",
  dateAdded: null,
};

export default function BookInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, admin } = useAuth();
  const[myReview, setMyReview]=useState(null)
  const [book, setBook] = useState(null);
  const [preview, setPreview] = useState(noImage);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editor, setEditor] = useState(false);
  const confirmDelete = useConfirmDelete();

  // user book states
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReading, setIsReading] = useState(false);

  /* ---------- Fetch editor status ---------- */
  const checkEditor = async (creatorId) => {
    try {
      const res = await api.get(`/isEditor/${creatorId}`);
      setEditor(res.data.editor);
    } catch {
      console.log('in vister mode')
    }
  };

  /* ---------- Fetch user book status ---------- */
  const fetchUserBookStatus = async () => {
    try {
      const res = await api.get(`/user/book-status/${id}`);
      setIsFavorite(res.data.favorite);
      setIsReading(res.data.currentlyReading);
    } catch {
      console.log('in vister mode')
    }
  };

  /* ---------- Fetch book ---------- */
  const fetchBook = async () => {
    try {
      const res = await api.get(`/book/${id}`);
      const b = res.data.book || PLACEHOLDER_BOOK;
      const mr=res.data.myReview
      setBook(b);
      

      if (b.coverImageUrl) setPreview(b.coverImageUrl);
      setMyReview(mr)
      await checkEditor(b.createdBy);
      await fetchUserBookStatus();
    } catch {
      setBook(PLACEHOLDER_BOOK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (book?.title) {
      document.title = `Books | ${book.title}`;
    }
  }, [book]);


  /* ---------- Toggle favorite ---------- */
  const toggleFavorite = async () => {
    try {
      await api.patch(`/user/addFav/${id}`);
      setIsFavorite((prev) => !prev);
      toast.success(!isFavorite ? "Added to favorites ❤️" : "Removed from favorites 💔");
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  /* ---------- Toggle reading ---------- */
  const toggleReading = async () => {
    try {
      await api.patch(`/user/addtoreading/${id}`);
      setIsReading((prev) => !prev);
      toast.success(!isReading ? "Marked as reading 📖" : "Reading stopped");
    } catch {
      toast.error("Failed to update reading status");
    }
  };

  /* ---------- Delete book ---------- */
  const handleDelete = async () => {
    confirmDelete({
      onStart: () => setDeleting(true),
      endpoint: `/book/${id}`,
      onSuccess: () => navigate("/books"),
      onFinally: () => setDeleting(false),
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-violet-600 animate-pulse">Loading book details...</div>
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
    averageRating,
    dateAdded,
    reviews,
  
  } = book || PLACEHOLDER_BOOK;

  const formattedDate = dateAdded ? new Date(dateAdded).toLocaleDateString("en-US") : "—";

  return (
    <>
    
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
                to={`/book/${id}/edit`}
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
              <div className="w-56 h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt={title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              {auth && (
                <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs">
                  <button
                    onClick={toggleFavorite}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                      ${
                        isFavorite
                          ? "bg-pink-100 text-pink-600 border-pink-200"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {isFavorite ? "★ Favorited" : "☆ Favorite"}
                  </button>

                  <button
                    onClick={toggleReading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                      ${
                        isReading
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {isReading ? "📖 Reading" : "▶ Read"}
                  </button>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">Added on: {formattedDate}</div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <Stars value={averageRating ?? 0} />

              <div className="border-t border-b py-4 my-4">
                <InfoRow label="Author">
                  <span
                    className="author-name cursor-pointer hover:underline hover:text-blue-800"
                    onClick={() =>
                      navigate(`/books?author=${encodeURIComponent(author)}`)
                    }
                  >
                    {author}
                  </span>
                </InfoRow>
                <InfoRow label="Language"><span
                    className="author-name cursor-pointer hover:underline hover:text-blue-800"
                    onClick={() =>
                      navigate(`/books?language=${encodeURIComponent(language)}`)
                    }
                  >
                    {language}
                  </span></InfoRow>
                <InfoRow label="Pages">{pageNumbers ? `${pageNumbers} pages` : "—"}</InfoRow>
                <InfoRow label="Year">{publishedYear}</InfoRow>
                <InfoRow label="ISBN">{isbn}</InfoRow>
                <InfoRow label="Genres">
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g, i) => (
                      <span
                        key={i}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-100"
                        onClick={() =>
                          navigate(`/books?genre=${encodeURIComponent(g)}`)
                        }
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
        </div>

        {/* Reviews Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-violet-600 mb-4">Reviews</h2>

          {/* Current user's review */}
          {auth && (
            <Review
              review={myReview}
              bookId={id}
              mode="self"
              onUpdate={fetchBook}
            />
          )}

          {/* Other users' reviews */}
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {reviews.map((r) => (
            <Review key={r._id} review={r} bookId={id} mode="other" />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
