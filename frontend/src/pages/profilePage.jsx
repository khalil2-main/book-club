import { Link } from "react-router-dom";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";

const ProfilePage = ({ mode }) => {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
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
        <UserProfile mode={mode} />
      </div>
    </>
  );
};

export default ProfilePage;
