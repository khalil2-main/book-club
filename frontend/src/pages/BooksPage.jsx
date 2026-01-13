import { useEffect, useState } from 'react';


import PageNav from '../components/pageNav';

import api from '../api/axiosInterceptor'
import Header from '../components/Header';
import BooksGrid from '../components/BooksGrid';
import { useSearchParams } from 'react-router-dom';


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
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <BooksGrid books={books} />
        <PageNav
          currentPage={page}
          totalPages={totalPages}
         
        />
      </div>
    </>
  );
}

