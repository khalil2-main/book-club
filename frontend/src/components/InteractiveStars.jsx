import React, { useState, useEffect } from "react";

export const InteractiveStars = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(value);

  useEffect(() => setRating(value), [value]);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isInteractive = typeof onChange === "function";
        const isActive = star <= (hover || rating);

        return (
          <svg
            key={star}
            className={`w-5 h-5 transition-colors ${isInteractive ? "cursor-pointer" : ""}`}
            fill={isActive ? "#178552" : "#D1D5DB"} 
            viewBox="0 0 20 20"
            {...(isInteractive
              ? {
                  onMouseEnter: () => setHover(star),
                  onMouseLeave: () => setHover(0),
                  onClick: () => {
                    setRating(star);
                    onChange?.(star);
                  },
                }
              : {})}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.044 9.4c-.784-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
          </svg>
        );
      })}
    </div>
  );
};
