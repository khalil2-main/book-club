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

export default BookCard