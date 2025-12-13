import Header from "../components/Header";

import axios from "axios";
import BookCarousel from "../components/BookCarousel";
import { useEffect, useState } from "react";

function HomePage() {
  
  const [books, setBooks] = useState([]);


  const fetchCarousel = async () => {
    try {
      const res = await axios.get('/api/book/top',{
        withCredentials:true
      });
      setBooks(res.data.books);
    } catch (err) {
      console.error('Failed to fetch top books:', err);
    }
  };

  useEffect(() => {
    fetchCarousel();   // only runs once when HomePage mounts
  }, []);

  return (
    <>
      <Header />
      <BookCarousel books={books} />
    </>
  );
}

export default HomePage;
