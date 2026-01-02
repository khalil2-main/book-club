import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import noImage from "../assets/images/no-picture.png";
import api from "../api/axiosInterceptor";
import { Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { auth, admin, logout, user } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [preview, setPreview] = useState(noImage);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1)

 
        

  useEffect(() => {
  if (!search.trim()) {
    setResults([]);
    return;
  }

  clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(async () => {
    try {
      const res = await api.get("/book", {
        params: {
          title: search,
          page: 1
        }
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

  const handleResultClick = (title) => {
    setSearch("");
    setShowResults(false);
    navigate(`/books?title=${encodeURIComponent(title)}`);
  };


  useEffect(()=>{
    if(auth && user){
      setPreview(user.profileImage ?? noImage);
    }
  },[auth, user])  
  // Close menu when clicking outside
  useEffect(() => {
   
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
        
      }
      if(searchRef.current && !searchRef.current.contains(e.target)){
        setShowResults(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },);

  // keybord navigation
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
      handleResultClick(results[activeIndex].title);
    } else if (search.trim()) {
      handleSearchNavigate();
    }
  }
};


  return (
    <header className="w-full bg-indigo-400 shadow-md">
      <div className="flex items-center justify-between py-3">

  {/* Logo + Books button */}
  <div className="flex items-center gap-4">
    {/* Logo */}
    <div 
      className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="logo" className="h-14 w-auto" />
      <h1 className="text-3xl text-white font-bold tracking-wide">
        BookClub
      </h1>
    </div>

    {/* Books button */}
    <button
      onClick={() => {navigate("/books"); setSearch('')}}
      className="text-white font-semibold hover:underline transition"
    >
      Books
    </button>
  </div>
  {/* Search bar */}
    <div ref={searchRef} className="relative w-80">
      <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none text-sm"
        />
        <Search
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-indigo-600"
          onClick={handleSearchNavigate}
        />
      </div>

      {/* Autocomplete results */}
      {showResults && results.length > 0 && (
  <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg z-50">
    {results.map((book, index) => (
      <div
        key={book._id}
        onClick={() => handleResultClick(book.title)}
        className={`px-4 py-2 cursor-pointer text-sm ${
          index === activeIndex ? "bg-indigo-100 text-indigo-900" : "text-gray-700"
        }`}
      >
        {book.title}
      </div>
    ))}
  </div>
)}

    </div>


  {/* Right side: Auth/User */}
  <div className="flex items-center gap-4 mr-4">
    {/* User profile picture */}
    {auth && (
      <div className="relative" ref={menuRef}>
        <img
          src={preview}
          alt="profile"
          className="h-10 w-10 rounded-full border-2 border-white cursor-pointer hover:opacity-90"
          onClick={() => setOpenMenu(!openMenu)}
        />
        {/* Dropdown Menu */}
        {openMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
            <button onClick={() => { navigate("/dashboard"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Dashboard</button>
            <button onClick={() => { navigate("/profile/me"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
            {admin && <button onClick={() => { navigate("/admin"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Admin</button>}
            <button onClick={() => { logout(); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
          </div>
        )}
      </div>
    )}

    {/* Guest buttons */}
    {!auth && (
      <>
        <button onClick={() => navigate("/signup")} className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition">
          Sign Up
        </button>
        <button onClick={() => navigate("/login")} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition">
          Log In
        </button>
      </>
    )}
  </div>
</div>

    </header>
  );
};

export default Header;
