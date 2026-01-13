import { useNavigate, useSearchParams } from "react-router-dom";

export default function PageNav({ currentPage, totalPages }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  const maxVisible = 10;
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    navigate(`/books?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* Prev */}
      <button
        className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 rounded-md transition ${
            p === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => goToPage(p)}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
