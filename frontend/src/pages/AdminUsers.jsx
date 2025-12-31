import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";
import useConfirmDelete from "../Hooks/ConfirmDelete";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });
  const navigate= useNavigate();
  const confirmDelete= useConfirmDelete()
  // ==============================
  // FETCH USERS (with filters)
  // ==============================
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user", {
        params,
        withCredentials: true,
      });
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Impossible de récupérer les comptes.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};
    if (query.firstname) params.firstname = query.firstname;
    if (query.lastname) params.lastname = query.lastname;
    if (query.email) params.email = query.email;
    if (query.role) params.role = query.role;

    fetchUsers(params);
  };

  // ==============================
  // DELETE USER
  // ==============================
const handleDelete = (id) => {
  confirmDelete({
    onStart:()=>setDeleting(true),
    endpoint:`/api/user/${id}`,
    onSuccess:() => setUsers((prev) => prev.filter((u) => u._id !== id)),
    onFinally:()=>setDeleting(false)
  })
};


  // ==============================
  // RESET FILTERS
  // ==============================
  const handleReset = () => {
    setQuery({
      firstname: "",
      lastname: "",
      email: "",
      role: "",
    });
    fetchUsers();
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-blue-50 py-8">
        <div className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto">
          <div className="bg-white rounded-2xl shadow p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Administration — Utilisateurs
              </h2>
              <div className="text-sm text-gray-500">
                {users.length} comptes
              </div>
            </div>

            {/* SEARCH FORM */}
            <form
              onSubmit={handleSearch}
              className="flex flex-wrap gap-3 mb-6"
            >
              <input
                className="border px-3 py-2 rounded w-40"
                placeholder="Prénom"
                value={query.firstname}
                onChange={(e) =>
                  setQuery({ ...query, firstname: e.target.value })
                }
              />

              <input
                className="border px-3 py-2 rounded w-40"
                placeholder="Nom"
                value={query.lastname}
                onChange={(e) =>
                  setQuery({ ...query, lastname: e.target.value })
                }
              />

              <input
                className="border px-3 py-2 rounded w-64"
                placeholder="Email"
                value={query.email}
                onChange={(e) =>
                  setQuery({ ...query, email: e.target.value })
                }
              />

              <select
                className="border px-3 py-2 rounded"
                value={query.role}
                onChange={(e) =>
                  setQuery({ ...query, role: e.target.value })
                }
              >
                <option value="">Tous</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Rechercher
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border rounded"
                >
                  Réinitialiser
                </button>
              </div>
            </form>

            {/* CONTENT */}
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div className="space-y-3">
                {users.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </div>
                ) : (
                  users.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {(u.firstname || "")[0]}
                          {(u.lastname || "")[0]}
                        </div>

                        <div>
                          <div className="font-medium">
                            {u.firstname} {u.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {u.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            u.admin
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.admin ? "Admin" : "User"}
                        </span>

                        <button
                          onClick={() => navigate(`/profile/${u._id}`)}
                          disabled={deleting}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          view
                        </button>
                        {/*delete use button*/}
                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={deleting}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          {deleting? 'deleting':'delete'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminUsers;
