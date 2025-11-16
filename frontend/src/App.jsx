
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage"
import Signup from "./pages/signup";
import Login from "./pages/login";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage/> } ></Route>     
        <Route path="signup" element={<Signup/> } ></Route>
        <Route path="login" element={<Login/> } ></Route>
      </Routes>
    </>
  );
};

export default App;
