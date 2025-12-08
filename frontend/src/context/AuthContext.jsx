import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const resCheck = await axios.get("/api/check", { withCredentials: true });

      setAuth(resCheck.data.auth);

      if (resCheck.data.auth) {
        const resAdmin = await axios.get("/api/isAdmin", { withCredentials: true });
        setAdmin(resAdmin.data.admin);
        

         const resUser = await axios.get("/api/user/me", { withCredentials: true });
        setUser(resUser.data.user);
      } else {
        setAdmin(false);
      }

    } catch (err) {
      console.error("Auth check failed:", err);
      setAuth(false);
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    setAuth(false);
    setAdmin(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <AuthContext.Provider value={{ auth, admin, loading,user, setUser, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = ()=> useContext(AuthContext)