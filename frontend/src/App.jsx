
import { Route, Routes } from "react-router";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "../src/components/UserProfile";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import RecentBooks from "./pages/RecentBooks";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/Notfound";

const App = () => {
  return (
    <>
      <Routes>
        
        {/* Public Routes */}
        <Route path="" element={<HomePage/> } ></Route>
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>

        <Route path="profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}></Route>
        <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path="admin" element={<AdminRoute><AdminUsers/></AdminRoute>}></Route>
          <Route path="recentbooks" element={<ProtectedRoute><RecentBooks/></ProtectedRoute>}></Route>

        <Route path="*" element={<NotFound/>} ></Route>
      </Routes>
    </>
  );
};

export default App;
