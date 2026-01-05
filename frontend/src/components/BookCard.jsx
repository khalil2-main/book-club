import { Link } from "react-router-dom";
import noImage from "../assets/images/default_book_cover.jpg";


const BookCard = ({ book }) => {
  const image = book.coverImageUrl || noImage;

  const truncate = (text, length = 20) =>
  text.length > length ? text.slice(0, length) + "…" : text;


  return (
    <Link
      to={`/book/${book._id}`}
      className="w-48 flex-shrink-0 bg-white rounded-lg shadow p-3"
    >
      <div className="w-full h-56 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={book.title}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = noImage;
          }}
        />
      </div>
      <h4 className="mt-2 font-semibold text-sm" title={book.title}>
      {truncate(book.title, 40)}
    </h4>

      <p className="text-xs text-gray-500">{book.author}</p>
    </Link>
  );
};

export default BookCard;
