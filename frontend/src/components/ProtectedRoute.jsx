import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!auth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
