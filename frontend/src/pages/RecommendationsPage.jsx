import { useEffect, useState } from 'react';


import PageNav from '../components/pageNav';
import Header from '../components/Header';
import BooksGrid from '../components/BooksGrid';
import api from '../api/axiosInterceptor';

export default function RecommendationsPage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
 

  // Fetch recommended books
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/books/recommendations', {
          params: { page } // optional: your API can implement pagination
        });

        // assuming API returns { recommendations: [...], totalPages }
        setBooks(res.data.recommendations || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [page]);

  return (
    <>
      <title>recommendations</title>
      <Header />

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold my-6">Recommended For You</h1>

        {/* Optional: Loading indicator */}
        {loading && <p className="text-center my-4">Loading recommendations...</p>}

        {/* No recommendations */}
        {!loading && books.length === 0 && (
          <p className="text-center my-4 text-gray-500">
            You don’t have enough activity for recommendations yet.
          </p>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && <BooksGrid books={books} />}

        {/* Pagination */}
        {totalPages > 1 && (
          <PageNav
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}
