import React from "react";
// ...existing code...
import Header from "../components/Header";
import BookCarousel from "../components/BookCarousel";
import ReadingStats from "../components/ReadingStats";
import ReadingLists from "../components/ReadingLists";

const Dashboard = () => {
  const mockBooks = [
    {id:2, title:"L'Étranger", author:"Albert Camus", cover:'/src/assets/images/no-picture.png'},
    {id:3, title:"Le Petit Prince", author:"Antoine de Saint-Exupéry", cover:'/src/assets/images/no-picture.png'},
    {id:4, title:"1984", author:"George Orwell", cover:'/src/assets/images/no-picture.png'},
    {id:5, title:"Le Rouge et le Noir", author:"Stendhal", cover:'/src/assets/images/no-picture.png'},
  ];

  const mockStats = { booksRead: 12, pagesRead: 3540, hoursRead: 78 };

  const [lists, setLists] = React.useState([
    {id:1, title:'À lire', books:[]},
    {id:2, title:"Favoris", books:[]}
  ]);

  const addList = (name) => {
    setLists(prev => [...prev, {id: Date.now(), title: name, books:[]}]);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-blue-50 flex items-center justify-center py-12">
        <div className="w-11/12 md:w-10/12 lg:w-8/12">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-indigo-600">Tableau de bord</h2>
            <p className="text-gray-600 mt-2">Bienvenue — voici un aperçu de votre activité et des nouveautés.</p>
          </div>
          <section className="mt-10 grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold text-indigo-600">Livres récents</h4>
              <p className="text-gray-600 mt-2">Découvrez les dernières sorties et recommandations.</p>
              <BookCarousel books={mockBooks} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h4 className="font-semibold text-indigo-600">Statistiques de lecture</h4>
                <p className="text-gray-600 mt-2">Suivez votre progression de lecture.</p>
                <div className="mt-4"><ReadingStats stats={mockStats} /></div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h4 className="font-semibold text-indigo-600">Listes de lecture</h4>
                <p className="text-gray-600 mt-2">Gérez vos listes personnelles de livres.</p>
                <div className="mt-4"><ReadingLists lists={lists} onAdd={addList} /></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Dashboard;