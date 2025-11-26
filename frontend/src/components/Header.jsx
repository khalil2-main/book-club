
import { useNavigate} from "react-router";

import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();

 

  const {auth , admin, logout}= useAuth();
  console.log(admin)

 

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

          {auth && (
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

          {admin && (
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
            >
              Admin
            </button>
          )}

          {!auth && (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
              >
                Log In
              </button>
            </>
          )}

          {auth && (
            <button
              onClick={logout}
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
