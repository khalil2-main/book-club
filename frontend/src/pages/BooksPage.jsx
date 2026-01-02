import { useEffect, useState } from 'react';


import PageNav from '../components/pageNav';

import api from '../api/api'
import Header from '../components/Header';
import BooksGrid from '../components/BooksGrid';
import { useNavigate, useSearchParams } from 'react-router-dom';


export default function BooksPage() {
  const [searchParams] = useSearchParams();

  const author = searchParams.get('author') || '';
  const title = searchParams.get('title') || '';
  const genre= searchParams.get('genre') || ''

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get(`/book`,{
           params: {
          page,
          author,
          title,
          genre
        }
        });
        setBooks(res.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [page, author, title,genre]);

  useEffect(() => {
    try {
      api.get('/book/npage',{
        params: {
          page,
          author,
          title,
          genre
        }
      }).then((res) => {
        setTotalPages(res.data.totalPages);
      });
    } catch (error) {
      console.error('Error fetching total pages:', error);
    }
  }, []);

  return (
    <>
      <Header />
      {/* Centered container */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Add Book button */}
        <div className="w-full flex justify-end my-4">
          <button
            onClick={() => navigate('/books/add')}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Add A New Book
          </button>
        </div>

        {/* Books Grid */}
        <BooksGrid books={books} />

        {/* Pages navigator*/}
        <PageNav
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
