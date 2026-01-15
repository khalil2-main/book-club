import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import noImage from "../assets/images/no-picture.png";
import api from "../api/axiosInterceptor";
import { Search, Filter } from "lucide-react";
import NavFilter from "./NavFilter";
import { useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { auth, admin, logout, user } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [preview, setPreview] = useState(noImage);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isNavOpen, setIsNavOpen] = useState(false); // Filter menu state

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/book", {
          params: { title: search, page: 1 }
        });

        setResults(res.data.books.slice(0, 4));
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleSearchNavigate = () => {
    if (!search.trim()) return;
    setShowResults(false);
    navigate(`/books?title=${encodeURIComponent(search)}`);
  };

  const handleResultClick = (id) => {
    setSearch("");
    setShowResults(false);
    navigate(`/book/${id}`);
  };

  useEffect(() => {
    if (auth && user) {
      setPreview(user.profileImage ?? noImage);
    }
  }, [auth, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleResultClick(results[activeIndex]._id);
      } else if (search.trim()) {
        handleSearchNavigate();
      }
    }
  };

  return (
    <>
    <header className="w-full bg-indigo-400 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
         {/* Filter Button */}
            <button
              onClick={() => setIsNavOpen(true)}
              className="bg-white text-indigo-600 p-2 rounded-xl shadow hover:bg-indigo-50"
            >
              <Filter className="w-5 h-5" />
            </button>
        {/* Logo + Nav */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="logo" className="h-10 sm:h-12 w-auto" />
            <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-bold tracking-wide">
              BookClub
            </h1>
          </div>

          <button
          onClick={() => { navigate("/books"); setSearch(""); }}
          className={`text-white text-sm sm:text-base font-semibold whitespace-nowrap
            ${location.pathname.startsWith("/books") && !location.pathname.includes("recommendations")
              ? "underline underline-offset-4 decoration-2"
              : "hover:underline"}
          `}
        >
            Books
          </button>

          {auth && (
           <button
          onClick={() => { navigate("/books/recommendations"); setSearch(""); }}
          className={`hidden sm:inline text-white text-sm sm:text-base font-semibold whitespace-nowrap
            ${location.pathname === "/books/recommendations"
              ? "underline underline-offset-4 decoration-2"
              : "hover:underline"}
          `}
        >
              Recommended for you
            </button>
          )}
        </div>

        {/* Search */}
        <div
          ref={searchRef}
           className="relative w-full sm:w-56 md:w-64 flex-grow max-w-80"
        >
          <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow w-full">
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => results.length && setShowResults(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 outline-none text-sm"
            />
            <Search
              className="w-4 h-5 text-gray-500 cursor-pointer hover:text-indigo-600"
              onClick={handleSearchNavigate}
            />
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((book, index) => (
                <div
                  key={book._id}
                  onClick={() => handleResultClick(book._id)}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    index === activeIndex
                      ? "bg-indigo-100 text-indigo-900"
                      : "text-gray-700"
                  }`}
                >
                  {book.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth / User */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {auth ? (
            <div className="relative" ref={menuRef}>
              <img
                src={preview}
                alt="profile"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                  
                  <button onClick={() => { navigate("/profile/me"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                  {admin && (
                    <button onClick={() => { navigate("/admin"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Admin</button>
                  )}
                  <button onClick={() => { logout(); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-indigo-600 text-sm sm:text-base font-semibold rounded-xl shadow hover:bg-indigo-50"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow hover:bg-indigo-700"
              >
                Log In
              </button>
            </>
          )}
        </div>

      </div>
    </header>
    {/* Sliding Filter Nav */}
      <NavFilter isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

    </>
  );
};

export default Header;
