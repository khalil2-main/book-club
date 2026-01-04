import BookCarousel from "../components/BookCarousel";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api/axiosInterceptor";

function HomePage() {
  const [books, setBooks] = useState([]);

  const fetchCarousel = async () => {
    try {
      const res = await api.get('/book/top');
      setBooks(res.data.books);
    } catch (err) {
      console.error('Failed to fetch top books:', err);
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, []);

  return (
    <>
      <title>Book club</title>
      <Header />
      <BookCarousel books={books} />
    </>
  );
}

export default HomePage;
