import { useNavigate } from "react-router-dom";
import {InteractiveStars} from "./InteractiveStars";

export default function UserReviewCard({ book }) {
  const navigate = useNavigate();
  const review = book.reviews?.[0];

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow">
      {/* Book Title */}
      <h3
        className="text-lg font-semibold text-indigo-600 cursor-pointer hover:underline"
        onClick={() => navigate(`/book/${book._id}`)}
      >
        {book.title}
      </h3>

      {/* Author */}
      <p className="text-sm text-gray-500 mb-2">by {book.author}</p>

      {/* Rating */}
      {review && (
        <InteractiveStars value={review.rating || 0} onChange={null} />
      )}

      {/* Comment */}
      <p className="mt-2 text-gray-700">
        {review?.Comment || "No comment"}
      </p>
    </div>
  );
}
