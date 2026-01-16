import { useEffect, useState } from 'react';


import PageNav from '../components/pageNav';

import api from '../api/axiosInterceptor'
import Header from '../components/Header';
import BooksGrid from '../components/BooksGrid';
import { useSearchParams,Link } from 'react-router-dom';


export default function BooksPage() {
  const [searchParams] = useSearchParams();
  

  const page = parseInt(searchParams.get('page')) || 1;
  const author = searchParams.get('author') || '';
  const title = searchParams.get('title') || '';
  const genre = searchParams.get('genre') || '';
  const language = searchParams.get('language') || '';

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    api.get('/book', {
      params: { page, author, title, genre, language }
    }).then(res => setBooks(res.data.books));
  }, [page, author, title, genre, language]);

  useEffect(() => {
    api.get('/book/npage', {
      params: { page, author, title, genre, language }
    }).then(res => setTotalPages(res.data.totalPages));
  }, [page, author, title, genre, language]);

  return (
    <>
    <title>Books - Book Club</title>
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center my-4">
        <h2 className="text-2xl font-bold">Books</h2>
        <Link
          to="/book/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700"
        >
          Add Book
        </Link>
      </div>

        <BooksGrid books={books} />
        <PageNav
          currentPage={page}
          totalPages={totalPages}
         
        />
      </div>
    </>
  );
}

