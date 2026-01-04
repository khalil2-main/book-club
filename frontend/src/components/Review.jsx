import React, { useState } from "react";
import { InteractiveStars } from "./InteractiveStars";
import toast from "react-hot-toast";
import api from "../api/axiosInterceptor";
import defaulProfileImage from "../assets/images/no-picture.png";
export default function Review({ review, bookId, mode = "other", onUpdate }) {
  const [editing, setEditing] = useState(mode === "self" && (!review || !review.Comment));
  const [comment, setComment] = useState(review?.Comment || "");
  const [rating, setRating] = useState(review?.rating || 0);

  const isSelf = mode === "self";

  const handleSave = async () => {
    try {
      await api.put(`/book/review/${bookId}`, null, {
        params: { rating, Comment: comment },
      });
      toast.success("Review saved!");
      setEditing(false);
      onUpdate?.(); // refresh book info
    } catch (err) {
      console.error(err);
      toast.error("Failed to save review");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex space-x-4">
      {/* User Profile */}
      <img
        src={review?.userId?.profileImage || defaulProfileImage}
        alt={review?.userId?.firstname || "User"}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-700">
            {review?.userId?.firstname} {review?.userId?.lastname}
          </p>
          {isSelf && !editing && (
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <div className="mt-1">
          {!editing? (rating>0)&&(
             <InteractiveStars value={rating} onChange={null} />
          ) : (
            <InteractiveStars value={rating} onChange={setRating} />
          )}
        </div>

        <div className="mt-2">
          {!editing ? (
            <p className="text-gray-600">{comment || "No comment."}</p>
          ) : (
            <div className="flex flex-col space-y-2">
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
