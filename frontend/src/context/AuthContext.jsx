import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object like { id, name, email }
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullUserLoading, setFullUserLoading] = useState(true);

  // Read token/user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Fetch full user info from /users/me when user is available
  useEffect(() => {
  if (!user) return;

  const fetchFullUser = async () => {
    try {
      const res = await axios.get("/users/me");
      console.log("Fetched full user:", res.data);
      setFullUser(res.data);
    } catch (err) {
      console.error("Error fetching full user:", err.response?.data || err.message);
      setFullUser(null);
    } finally {
      setFullUserLoading(false);
    }
  };

  fetchFullUser();
}, [user]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fullUser, fullUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);
