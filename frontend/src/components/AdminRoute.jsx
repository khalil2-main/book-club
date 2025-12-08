import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { auth, admin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!auth) return <Navigate to="/login" replace />;

  if (!admin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
