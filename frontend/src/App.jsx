
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage"
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserProfile from "./components/UserProfile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage/> } ></Route>     
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>
        <Route path="profile" element={<UserProfile/>}></Route>
        <Route path="*" element={<h1>404 Not Found</h1>} ></Route>
      </Routes>
    </>
  );
};

export default App;
