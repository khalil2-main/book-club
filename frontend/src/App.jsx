
import { Route, Routes } from "react-router";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "../src/components/UserProfile";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import AllBooks from "./pages/AllBooks";
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage/> } ></Route>
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>
        <Route path="profile" element={<UserProfile/>}></Route>
        <Route path="dashboard" element={<Dashboard/>}></Route>
        <Route path="addbook" element={<AddBook/>}></Route>
        <Route path="admin" element={<AdminUsers/>}></Route>
        <Route path="books" element={<AllBooks/>}></Route>
        <Route path="books/:id" element={<BookDetail/>}></Route>
        <Route path="*" element={<h1>404 Not Found</h1>} ></Route>
      </Routes>
    </>
  );
};

export default App;
