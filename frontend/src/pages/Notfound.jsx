import React from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import SideImage from "../components/sideimage";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-blue-50 flex items-center justify-center py-12">
        <div className="w-11/12 md:w-10/12 lg:w-8/12">
          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6 text-center md:text-left">
              <h1 className="text-5xl font-extrabold text-indigo-600">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>

              <p className="text-gray-600">
                Oups ! La page que vous cherchez n’existe pas ou a été déplacée.
              </p>

              <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Retour à l'accueil
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 transition"
                >
                  Tableau de bord
                </button>
              </div>

              <div className="mt-6 text-gray-500 text-sm">
                Si vous pensez que c’est une erreur, veuillez contacter le support.
              </div>
            </div>

            
            <div className="w-full md:w-1/2">
              <SideImage />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default NotFound;
