import noImage from "../assets/images/no-picture.png";


const ProfileInfo = ({ user, id={} }) => {
  return (
    <div className="w-[30%] p-6 flex flex-col items-center">
    <img
      src={user.profileImage || noImage}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover mb-4 border"
    />

    <h2 className="text-2xl font-semibold">
      {user.firstname} {user.lastname}
    </h2>

    <p className="text-gray-600">{user.email}</p>

    <div className="mt-6 w-full space-y-2 text-sm">
      <p>
        <strong>Birthday:</strong>{" "}
        {new Date(user.birthday).toLocaleDateString()}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {user.address?.location},{" "}
        {user.address?.city},{" "}
        {user.address?.country}
      </p>
    </div>
    <div>
    <NavLink
      to={id ? `/profile/edit/${id}` : '/profile/edit/me'}
      className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
    >
      Edit Profile
    </NavLink>

    </div>
  </div>

  );
}
export default ProfileInfo;