import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/check-auth", {
        withCredentials: true,
      });

      setAuth(res.data.user);
    } catch (err) {
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
