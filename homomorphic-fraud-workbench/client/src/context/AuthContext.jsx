import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

const tokenKey = 'fraud-workbench-token';
const userKey = 'fraud-workbench-user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenKey);
    const storedUser = localStorage.getItem(userKey);
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (authToken, userData) => {
    localStorage.setItem(tokenKey, authToken);
    localStorage.setItem(userKey, JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setUser(null);
    navigate('/login');
  };

  const getToken = () => localStorage.getItem(tokenKey);

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
