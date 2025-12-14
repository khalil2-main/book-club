import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import noImage from "../assets/images/no-picture.png";

const Header = () => {
  const navigate = useNavigate();
  const { auth, admin, logout, user } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [preview, setPreview] = useState(noImage);

 
        

    
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },);

  

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
      onClick={() => navigate("/books")}
      className="text-white font-semibold hover:underline transition"
    >
      Books
    </button>
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
            <button onClick={() => { navigate("/profile"); setOpenMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
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
