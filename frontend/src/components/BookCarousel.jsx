import React from 'react';

const BookCard = ({book}) => (
  <div className="w-48 flex-shrink-0 bg-white rounded-lg shadow p-3">
    <img src={book.cover} alt={book.title} className="w-full h-56 object-cover rounded" />
    <h4 className="mt-2 font-semibold text-sm">{book.title}</h4>
    <p className="text-xs text-gray-500">{book.author}</p>
  </div>
);

const BookCarousel = ({books}) => {
    const navigateToRecentBooks = () => {
      window.location.href = '/recentbooks';
    };
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-4 px-2">
        {books.map(b => <BookCard key={b.id} book={b} />)}
      </div>
        <div className="mt-4 flex justify-end">
          <button onClick={navigateToRecentBooks} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Aller à la page RecentBooks
          </button>
        </div>
    </div>
  );
}

export default BookCarousel;