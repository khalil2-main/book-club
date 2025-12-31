
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
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
import BookInfo from "./pages/BookInfo";
import EditBookPage from "./pages/EditBookPage";
import ProfilePage from "./pages/profilePage";
import EditProfilePage from "./pages/EditProfilePage";

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
        {/* User Routes */}
        <Route path="profile/me" element={<ProtectedRoute><ProfilePage mode="self"/></ProtectedRoute>}></Route>
        <Route path="profile/edit/me" element={<ProtectedRoute><EditProfilePage mode="self"/></ProtectedRoute>}></Route>

        <Route path="profile/:id" element={<ProtectedRoute><ProfilePage mode="public"/></ProtectedRoute>}></Route>
         <Route path="profile/edit/:id" element={<ProtectedRoute><EditProfilePage mode="public"/></ProtectedRoute>}></Route>

        <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path="admin" element={<AdminRoute><AdminUsers/></AdminRoute>}></Route>
        {/* books related routes */}
          <Route path="recentbooks" element={<ProtectedRoute><RecentBooks/></ProtectedRoute>}></Route>
        <Route path='books' element={<BooksPage/>}></Route>
        <Route path='books/:id' element={<BookInfo/>}></Route>
       <Route path="books/add" element={<ProtectedRoute> <AddBook/> </ProtectedRoute>}></Route>
       <Route path="books/:id/edit" element={<ProtectedRoute> <EditBookPage/> </ProtectedRoute>}></Route>

        <Route path="*" element={<NotFound/>} ></Route>
      </Routes>
    </>
  );
};

export default App;
