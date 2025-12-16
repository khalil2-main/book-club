
import Header from "../components/Header";
import BookForm from "../components/BookForm";
import { useParams } from "react-router";

const EditBookPage = () => {
  const { id } = useParams();

  
  <title>Edit Book</title>;
  if (!id) {
    return <p className="p-6">Invalid book ID</p>;
  }
  
  return (
    <>
      <Header />
      <BookForm bookId={id} />
    </>
  );
};

export default EditBookPage;
