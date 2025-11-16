import { useNavigate } from "react-router";
import logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();

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

        {/* HEader Buttons */}
        <div className="flex items-center gap-4 mr-3">
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
        </div>

      </div>
    </header>
  );
};

export default Header;
