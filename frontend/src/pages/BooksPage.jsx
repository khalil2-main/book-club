import { useEffect, useState } from 'react';


import PageNav from '../components/pageNav';

import axios from 'axios';
import Header from '../components/header';
import BooksGrid from '../components/BooksGrid';


export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/book?page=${page}`);
        setBooks(res.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [page]);

  useEffect(() => {
    try {
      axios.get('/api/book/npage').then((res) => {
        setTotalPages(res.data.totalPages);
      });
    } catch (error) {
      console.error('Error fetching total pages:', error);
    }
  }, []);
  // --UI--
  return (
    <>
      <Header/>
      <BooksGrid books={books} />
      <PageNav
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
