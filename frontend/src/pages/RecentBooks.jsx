import React, { useEffect } from "react";
import { useNavigate } from "react-router";

// RecentBooks removed — redirect to All Books
const RecentBooks = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/books", { replace: true });
  }, [navigate]);
  return null;
};

export default RecentBooks;
