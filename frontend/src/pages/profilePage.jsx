import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import useConfirmDelete from "../Hooks/ConfirmDelete";

const ProfilePage = ({ mode }) => {
  const { admin } = useAuth();
  const { id } = useParams();
  const navigate= useNavigate()
  const confirmDelete= useConfirmDelete();
  const [deleting, setDeleting]=useState(false)
  const handleDelete = (id) => {
  confirmDelete({
    onStart:()=>setDeleting(true),
    endpoint:`/api/user/${id}`,
    onSuccess:() => navigate('/'),
    onFinally:()=>setDeleting(false)
  })
};
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Self profile edit */}
        {mode === "self" && (
          <div className="flex justify-end mb-4">
            <Link
              to="/profile/edit/me"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Admin editing someone else's profile */}
        {admin && id && (

          <div className="flex justify-end mb-4 space-x-3">
            <button
              disabled={deleting}
              onClick={()=>handleDelete(id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              delete
            </button>
            <button
              onClick={()=>navigate(`/profile/edit/${id}`)}
              disabled={deleting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          </div>
        )}

        <UserProfile mode={mode} />
      </div>
    </>
  );
};

export default ProfilePage;
