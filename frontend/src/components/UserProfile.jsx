import  { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

import toast from "react-hot-toast";
import ProfileInfo from "./ProfileInfo";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = id ? `/api/user/${id}` : "/api/user/me";
        const res = await axios.get(url, { withCredentials: true });
        setUser(res.data.user);
        console.log('Fetched user data:');
        console.log(user);
      } catch (err) {
        toast.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!user) return null;

  const favoriteBooks = user.books;

  return (
    <>
      <Header />

     <div className="bg-white  shadow-2xl  flex mx-auto my-10 rounded-lg">

  {/* LEFT – FAVORITE BOOKS (70%) */}
   <ProfileInfo user={user} id={id} />
   {/* RIGHT – USER INFO (30%) */}
  <div className="w-[70%] p-6 border-r">
    <h2 className="text-xl font-semibold mb-4">Favorite Books</h2>

    {favoriteBooks?.length ? (
      <ul className="space-y-4">
        {favoriteBooks.map((item) => (
          <li
            key={item.bookId._id}
            className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg"
          >
            <img
              src={item.bookId.coverImage}
              alt={item.bookId.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{item.bookId.title}</h3>
              <p className="text-sm text-gray-600">
                {item.bookId.author}
              </p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No favorite books</p>
    )}
  </div>

 
 

</div>

    </>
  );
};

export default UserProfile;
