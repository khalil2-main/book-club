import api from "../api/axiosInterceptor";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const resCheck = await api.get("/check");

      setAuth(resCheck.data.auth);

      if (resCheck.data.auth) {
        const resAdmin = await api.get("/isAdmin", );
        setAdmin(resAdmin.data.admin);
        

         const resUser = await api.get("/user/me", );
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
    await api.get("/logout", );
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