
export /* ---------- Star rating ---------- */
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
