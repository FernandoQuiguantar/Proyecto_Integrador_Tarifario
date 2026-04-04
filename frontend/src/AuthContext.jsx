import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tarifario_user');
    if (stored) setUser(JSON.parse(stored));
    setLoadingRol(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('tarifario_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tarifario_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      account: user,
      rol: user?.rol || null,
      loadingRol,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
