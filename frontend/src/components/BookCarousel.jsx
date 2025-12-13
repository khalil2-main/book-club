import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


const BookCard = ({ book }) => (
  <Link
    key={book._id}
    className="w-48 flex-shrink-0 bg-white rounded-lg shadow p-3"
  >
    <div className="w-full h-56 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
      <img
        src={book.coverImageUrl}
        alt={book.title}
        className="max-w-full max-h-full object-contain"
      />
    </div>
    <h4 className="mt-2 font-semibold text-sm">{book.title}</h4>
    <p className="text-xs text-gray-500">{book.author}</p>
  </Link>
);

const BookCarousel = ({ books }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 260; // adjust based on card width
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full py-4">

      {/* LEFT BUTTON */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"
        onClick={() => scroll("left")}
      >
        <ChevronLeft />
      </button>

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex gap-4 px-12"> {/* padding so books don't hide behind arrows */}
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      </div>

      {/* RIGHT BUTTON */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"
        onClick={() => scroll("right")}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default BookCarousel;
