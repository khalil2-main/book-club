import { useEffect, useState, useRef } from "react";
import api from "../api/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { languages, genreOptions } from "../constants/array";
import { XIcon } from "lucide-react";

const NavFilter = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    language: "",
    genres: []
  });

  // Author search state
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorResults, setAuthorResults] = useState([]);
  const [showAuthorResults, setShowAuthorResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // Author search with debouncing
  useEffect(() => {
    if (authorSearch.trim().length < 2) {
      setAuthorResults([]);
      setShowAuthorResults(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/book", { 
          params: { author: authorSearch, page: 1 }
        });
        setAuthorResults(res.data.books.slice(0, 5));
        setShowAuthorResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [authorSearch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!authorResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % authorResults.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + authorResults.length) % authorResults.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < authorResults.length) {
        selectAuthor(authorResults[activeIndex].author);
      }
    }
  };

  const selectAuthor = (author) => {
    setAuthorSearch(author);
    setAuthorResults([]);
    setShowAuthorResults(false);
    setActiveIndex(-1);
  };

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowAuthorResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate with only filled fields
  const handleFilterNavigate = () => {
    const queryObject = {};
    if (form.title) queryObject.title = form.title;
    if (authorSearch) queryObject.author = authorSearch;
    if (form.language) queryObject.language = form.language;
    if (form.genres.length > 0) queryObject.genre = form.genres.join(",");

    const query = new URLSearchParams(queryObject).toString();
    navigate(`/books?${query}`);
    onClose();
     setForm({
    title: "",
    language: "",
    genres: []
    });
    setAuthorSearch("");
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-indigo-400 shadow-md transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "30%" }}
    >
     <div className="p-4 flex flex-col gap-4">
        <button
          onClick={onClose}
          className=" top-4 right-4 text-white text-xl font-bold"
        >
          <XIcon  />
        </button>

        {/* Author search */}
        <div ref={searchRef} className="relative">
          <input
            type="text"
            placeholder="Search Author"
            value={authorSearch}
            onChange={e => setAuthorSearch(e.target.value)}
            onFocus={() => authorResults.length && setShowAuthorResults(true)}
            onKeyDown={handleKeyDown}
            className="p-2 rounded w-full bg-white"
          />
          {showAuthorResults && authorResults.length > 0 && (
            <ul className="absolute top-full mt-1 left-0 w-full bg-white rounded shadow max-h-40 overflow-auto z-50">
              {authorResults.map((book, index) => (
                <li
                  key={book._id}
                  className={`p-2 cursor-pointer ${
                    index === activeIndex ? "bg-indigo-100 text-indigo-900" : "text-gray-700"
                  }`}
                  onClick={() => selectAuthor(book.author)}
                >
                  {book.author}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Book title */}
        <input
          type="text"
          placeholder="Book Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="p-2 rounded bg-white"
        />

        {/* Language */}
        <select
          className="border border-gray-400 rounded p-2 w-full bg-white"
          value={form.language}
          onChange={e => setForm({ ...form, language: e.target.value })}
        >
          <option value="">Select language</option>
          {languages.map(lg => (
            <option key={lg} value={lg}>{lg}</option>
          ))}
        </select>

        {/* Genres */}
        <select
          className="border border-gray-400 rounded p-2 w-full bg-white"
          onChange={e => {
            const selected = e.target.value;
            if (!selected) return;
            if (!form.genres.includes(selected)) {
              setForm(prev => ({ ...prev, genres: [...prev.genres, selected] }));
            }
            e.target.value = "";
          }}
        >
          <option value="">Select genre…</option>
          {genreOptions.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-3">
          {form.genres.map(g => (
            <span key={g} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              {g}
              <button type="button" className="text-red-500 font-bold" onClick={() => setForm(prev => ({ ...prev, genres: prev.genres.filter(item => item !== g) }))}>
                ×
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleFilterNavigate}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Search Books
        </button>
      </div>
    </nav>
  );
};

export default NavFilter;
