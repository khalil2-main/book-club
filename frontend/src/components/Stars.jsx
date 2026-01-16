import React from "react";

export const Stars = ({ value = 0 }) => {
  // Step value between 0 and 10
  const steps = Math.round(value * 2);
  const percent = steps * 5;

  const ratingImage = `/images/ratings/rating-${percent}.png`;

  return (
    <div className="flex items-center space-x-2">
      <img
        src={ratingImage}
        alt="stars"
        className="w-24 h-10 object-contain"
      />

      {/* Numeric display */}
      <span className="text-xs text-gray-500 ml-2">
        ({value.toFixed(1)})
      </span>
    </div>
  );
};
