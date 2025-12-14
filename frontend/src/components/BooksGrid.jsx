import BookCard from "./BookCard";


export default function BooksGrid({ books }) {
  return (
    <div
      className={`grid gap-6 
                  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                  w-full max-w-[calc(200px*5)] mx-auto
                  mt-6`} 
    >
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
