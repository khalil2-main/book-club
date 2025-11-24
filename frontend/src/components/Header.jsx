import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        await axios.get("/api/user/me", { withCredentials: true });
        if (mounted) setIsAuth(true);
      } catch (err) {
        console.debug("Auth check failed:", err?.message || err);
        if (mounted) setIsAuth(false);
      }
    };

    checkAuth();
    return () => (mounted = false);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/logout", { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuth(false);
      navigate("/login");
    }
  };

  return (
    <header className="w-full bg-indigo-400 shadow-md">
      <div className="  flex items-center justify-between  py-3">

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

        {/* Header Buttons */}
        <div className="flex items-center gap-4 mr-3">

          {isAuth && (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-3 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
              >
                Profile
              </button>
            </>
          )}

          {["/login", "/signup"].includes(location.pathname) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
            >
              Admin
            </button>
          )}

          {!isAuth && (
            <>
              <button
                onClick={() => navigate("../signup")}
                className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("../login")}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
              >
                Log In
              </button>
            </>
          )}

          {isAuth && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
