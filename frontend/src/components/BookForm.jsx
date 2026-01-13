import { useState, useEffect } from "react";
import api from "../api/axiosInterceptor";
import noImage from "../assets/images/add.png";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import ImageDropZone from "./ImageDropZone";
import { genreOptions, languages } from "../constants/array";

export default function BookForm({ bookId }) {
  const navigate = useNavigate();



  const [book, setBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    pageNumbers: "",
    genres: [],
    summary: "",
    isbn: "",
    publishedYear: "",
    status: "reading",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(noImage);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch book if editing
  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        const res = await api.get(`/book/${bookId}`);
        const fetchedBook = res.data.book;
        setBook(fetchedBook);

        setForm({
          title: fetchedBook.title || "",
          author: fetchedBook.author || "",
          language: fetchedBook.language || "",
          pageNumbers: fetchedBook.pageNumbers || "",
          genres: fetchedBook.genres || [],
          summary: fetchedBook.summary || "",
          isbn: fetchedBook.isbn || "",
          publishedYear: fetchedBook.publishedYear || "",
          status: fetchedBook.status || "reading",
          image: null,
        });

        setPreview(fetchedBook.coverImageUrl || noImage);
      } catch (err) {
        console.error("Failed to fetch book:", err);
      }
    };

    fetchBook();
  }, [bookId]);
useEffect(() => {
  if (book?.title) {
    document.title = `${book.title} | Edit`;
  }
}, [book]);

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return !value.trim() || value.length < 3 ? "Title must be at least 3 characters." : "";
      case "author":
        return !value.trim() || value.length < 3 ? "Author must be at least 3 characters." : "";
      case "language":
        return value && value.length < 3 ? "Language must be at least 3 characters." : "";
      case "pageNumbers":
        if (Number.isNaN(Number(value))) return "Only numbers are allowed.";
        if (Number(value) < 5 || Number(value) > 3000) return "Pages must be between 5 and 3000.";
        return "";
      case "genres":
        return value.length === 0 ? "Genres cannot be empty." : "";
      case "isbn":
        return value && !/^\d{10}(\d{3})?$/.test(value) ? "ISBN must be 10 or 13 digits." : "";
      case "publishedYear":
        if (Number.isNaN(Number(value))) return "Please insert year in numbers.";
        if (value < 1700 || value > new Date().getFullYear()) return "Invalid published year.";
        return "";
      case "summary":
        return value.length > 2000 ? "Summary cannot exceed 2000 characters." : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate all fields
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "genres") {
          value.forEach(g => formData.append("genres", g));
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      let res;
      if(book) {
        console.log(formData)
         res=await api.patch(`/book/${bookId}`,formData, {
          headers: { "Content-Type": "multipart/form-data" }

         });
         
         navigate(`/book/${res.data.book._id}`);
         
      }
      else {
       res= await api.post("/book/", formData, { 
          headers: { "Content-Type": "multipart/form-data" }
      }
      );
      navigate(`/books`);
      }

      
    } catch (err) {
      console.error(err.response.data);
      setSubmitError(err?.response?.data?.errors || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="w-4/5 mx-auto bg-gray-100 p-8 rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-6">{book ? "Edit Book" : "Add a New Book"}</h2>

        {/* Cover Upload */}
          <div className="mb-6">
    <ImageDropZone
    
      value={preview}
      onChange={(file) => {
        setPreview(URL.createObjectURL(file));
        setForm((prev) => ({ ...prev, image: file }));
         
      }}
       className="w-40 h-56 object-cover rounded shadow"
      previewClassName="w-40 h-56 object-cover rounded shadow"
      previewAlign="left"
      error={errors.image}
    />
  </div>


        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} onBlur={handleChange} error={errors.title} />
          <Input name="author" placeholder="Author" value={form.author} onChange={handleChange} onBlur={handleChange} error={errors.author} />
          <select name="language"
              className="border border-gray-400 rounded p-2 w-full" 
              value={form.language}
              onChange={handleChange}
              onBlur={handleChange}>
              
            <option value=''> select language </option>
            {languages.map(lg =><option key={lg} value={lg}>{lg}</option> )}
          </select>
          
          <Input name="pageNumbers" type="number" placeholder="Pages" value={form.pageNumbers} onChange={handleChange} onBlur={handleChange} error={errors.pageNumbers} />

          {/* Genre Selector */}
          <div className="md:col-span-2">
            <select
              className="border border-gray-400 rounded p-2 w-full"
              onChange={(e) => {
                const selected = e.target.value;
                if (!selected) return;
                if (!form.genres.includes(selected)) setForm(prev => ({ ...prev, genres: [...prev.genres, selected] }));
                e.target.value = "";
              }}
            >
              <option value="">Select genre…</option>
              {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.genres.map(g => (
                <span key={g} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {g}
                  <button type="button" className="text-red-500 font-bold" onClick={() => setForm(prev => ({ ...prev, genres: prev.genres.filter(item => item !== g) }))}>×</button>
                </span>
              ))}
            </div>

            {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
          </div>

          <Input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} onBlur={handleChange} error={errors.isbn} />
          <Input name="publishedYear" type="number" placeholder="Published Year" value={form.publishedYear} onChange={handleChange} onBlur={handleChange} error={errors.publishedYear} />

          <div className="md:col-span-4">
            <label className="font-medium mb-1">Summary</label>
            <textarea name="summary" value={form.summary} onChange={handleChange} className={`w-full border rounded p-2 h-28 ${errors.summary ? "border-red-500" : "border-gray-400"}`} />
            {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
          </div>

          {submitError && <p className="text-red-600 md:col-span-4">{submitError}</p>}

          <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 md:col-span-4" disabled={loading}>
            {loading ? "Saving..." : book ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}
