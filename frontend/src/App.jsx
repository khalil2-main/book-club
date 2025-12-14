
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "../src/components/UserProfile";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import RecentBooks from "./pages/RecentBooks";
import AddBook from "./pages/AddBook";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/Notfound";
import { Toaster } from "react-hot-toast";
import BooksPage from "./pages/BooksPage";

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" 
      toastOptions={{
    success: {
      duration: 3000,
      style: {
        background: "#4f46e5",
        color: "#fff",
      },
    },
    error: {
      duration: 4000,
      style: {
        background: "#dc2626",
        color: "#fff",
      },
    },
    }}
      />

      <Routes>
        
        {/* Public Routes */}
        <Route path="" element={<HomePage/> } ></Route>
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>

        <Route path="profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}></Route>
        <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path="admin" element={<AdminRoute><AdminUsers/></AdminRoute>}></Route>
          <Route path="recentbooks" element={<ProtectedRoute><RecentBooks/></ProtectedRoute>}></Route>
        <Route path='books' element={<ProtectedRoute><BooksPage/></ProtectedRoute>}></Route>
       <Route path="addBook" element={<ProtectedRoute> <AddBook/> </ProtectedRoute>}></Route>

        <Route path="*" element={<NotFound/>} ></Route>
      </Routes>
    </>
  );
};

export default App;
