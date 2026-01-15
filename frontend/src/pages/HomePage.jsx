import BookCarousel from "../components/BookCarousel";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/axiosInterceptor";
import BooksGrid from "../components/BooksGrid";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);

  const fetchCarousel = async () => {
    try {
      const res = await api.get('/book/top');
      setTopBooks(res.data.books);
    } catch (err) {
      console.error('Failed to fetch top books:', err);
    }
  };
  const fetchfirstpage = async () => {
    try {
      const res = await api.get('/book/', { params: { page: 1 } });
      setBooks(res.data.books);
    } catch (err) {
      console.error('Failed to fetch top books:', err);
    }
  };

  useEffect(() => {
    fetchCarousel();
    fetchfirstpage();
  }, []);

  return (
    <>
      <title>Book club</title>
      <Header />
      <BookCarousel books={topBooks} />
      <BooksGrid books={books} />
    </>
  );
}

export default HomePage;
