
import { Route, Routes } from "react-router";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "../src/components/UserProfile";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import RecentBooks from "./pages/RecentBooks";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage/> } ></Route>
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>
        <Route path="profile" element={<UserProfile/>}></Route>
        <Route path="dashboard" element={<Dashboard/>}></Route>
        <Route path="admin" element={<AdminUsers/>}></Route>
          <Route path="recentbooks" element={<RecentBooks/>}></Route>
        <Route path="*" element={<h1>404 Not Found</h1>} ></Route>
      </Routes>
    </>
  );
};

export default App;
