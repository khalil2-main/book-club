import React from "react";
import Header from "./components/header";
import SideImage from "./components/sideimage";
import LoginSignup from "./components/loginsignup";

const App = () => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-8/12">
          
          <div className="w-full md:w-1/2 flex items-center justify-center p-2">
            <LoginSignup />
          </div>

          <div className="w-full md:w-1/2">
            <SideImage />
          </div>

        </div>
      </div>
    </>
  );
};

export default App;
