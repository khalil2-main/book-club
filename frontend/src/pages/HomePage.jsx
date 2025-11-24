
import React from "react";
import Header from "../components/Header";
import SideImage from "../components/sideimage";
import { useNavigate } from "react-router";
import axios from "axios";

function HomePage(){
  const navigate = useNavigate();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        await axios.get('/api/user/me', { withCredentials: true });
        if (mounted) navigate('/dashboard');
      } catch (err) {
        void err;
        // not authenticated -> stay on homepage
      } finally {
        if (mounted) setChecking(false);
      }
    };
    checkAuth();
    return () => (mounted = false);
  }, [navigate]);

  if (checking) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-blue-50 flex items-center justify-center py-12">
        <div className="w-11/12 md:w-10/12 lg:w-8/12">
          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600">BookClub</h1>
              <p className="text-gray-600">Rejoignez notre communauté de lecteurs : partagez vos avis, découvrez de nouveaux livres et participez à des discussions.</p>

              <div className="flex flex-wrap gap-3 mt-2">
                <button onClick={() => navigate('/signup')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Get Started</button>
                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg shadow hover:bg-indigo-50 transition">Log in</button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700">Pourquoi BookClub ?</h3>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li>• Recommandations personnalisées</li>
                  <li>• Groupes de lecture et événements</li>
                  <li>• Suivi de vos lectures et notes</li>
                </ul>
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

export default HomePage;