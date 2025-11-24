import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState({ firstname: "", lastname: "", email: "", role: "" });

  const [adminAuth, setAdminAuth] = useState({ email: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user", { params, withCredentials: true });
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Impossible de récupérer les comptes (auth requise pour admin).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifie si l'utilisateur courant est admin
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/user/me", { withCredentials: true });
        if (res.data.user && res.data.user.admin) {
          setIsAdmin(true);
          fetchUsers();
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query.firstname) params.firstname = query.firstname;
    if (query.lastname) params.lastname = query.lastname;
    if (query.email) params.email = query.email;
    if (query.role) params.role = query.role;
    fetchUsers(params);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`/api/user/${id}`, { withCredentials: true });
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Impossible de supprimer l'utilisateur.");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await axios.post("/api/login", adminAuth, { withCredentials: true });
      if (res.data.user && res.data.user.admin) {
        setIsAdmin(true);
        fetchUsers();
      } else {
        setAuthError("Accès refusé : vous n'êtes pas administrateur.");
      }
    } catch {
      setAuthError("Email ou mot de passe incorrect.");
    }
  };

  return (
        <>
          <Header />
          <main className="min-h-screen bg-blue-50 py-8">
            <div className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto">
              <div className="bg-white rounded-2xl shadow p-6">
                {!isAdmin ? (
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Connexion administrateur</h2>
                    <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                      <input
                        type="email"
                        placeholder="Email admin"
                        className="border px-3 py-2 rounded"
                        value={adminAuth.email}
                        onChange={e => setAdminAuth({ ...adminAuth, email: e.target.value })}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Mot de passe"
                        className="border px-3 py-2 rounded"
                        value={adminAuth.password}
                        onChange={e => setAdminAuth({ ...adminAuth, password: e.target.value })}
                        required
                      />
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded">Se connecter</button>
                      {authError && <div className="text-red-600 text-center">{authError}</div>}
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold">Administration — Utilisateurs</h2>
                      <div className="text-sm text-gray-500">{users.length} comptes</div>
                    </div>
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
                      <input
                        className="border px-3 py-2 rounded w-40"
                        placeholder="Prénom"
                        value={query.firstname}
                        onChange={(e) => setQuery({ ...query, firstname: e.target.value })}
                      />
                      <input
                        className="border px-3 py-2 rounded w-40"
                        placeholder="Nom"
                        value={query.lastname}
                        onChange={(e) => setQuery({ ...query, lastname: e.target.value })}
                      />
                      <input
                        className="border px-3 py-2 rounded w-64"
                        placeholder="Email"
                        value={query.email}
                        onChange={(e) => setQuery({ ...query, email: e.target.value })}
                      />
                      <select
                        className="border px-3 py-2 rounded"
                        value={query.role}
                        onChange={(e) => setQuery({ ...query, role: e.target.value })}
                      >
                        <option value="">Tous</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Rechercher</button>
                        <button type="button" onClick={() => { setQuery({ firstname: '', lastname: '', email: '', role: '' }); fetchUsers(); }} className="px-4 py-2 border rounded">Réinitialiser</button>
                      </div>
                    </form>

                    {loading ? (
                      <div className="text-center py-8">Chargement...</div>
                    ) : error ? (
                      <div className="text-red-600">{error}</div>
                    ) : (
                      <div className="space-y-3">
                        {users.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">Aucun utilisateur trouvé</div>
                        ) : (
                          users.map((u) => (
                            <div key={u._id} className="flex items-center justify-between p-4 border rounded">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">{(u.firstname||'')[0]}{(u.lastname||'')[0]}</div>
                                <div>
                                  <div className="font-medium">{u.firstname} {u.lastname}</div>
                                  <div className="text-sm text-gray-500">{u.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded text-sm ${u.admin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{u.admin ? 'Admin' : 'User'}</div>
                                <button
                                  onClick={() => handleDelete(u._id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>

        </>
      );
}
export default AdminUsers;
