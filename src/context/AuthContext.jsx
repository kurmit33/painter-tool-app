import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/api';
import {
  clearAuth,
  getToken,
  getUser,
  setToken,
  setUser,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken && savedUser) {
      setTokenState(savedToken);
      setUserState(savedUser);
    }

    setLoading(false);
  }, []);

    async function register(email, password) {
    return registerRequest(email, password);
    }

  async function login(email, password) {
    const data = await loginRequest(email, password);

    setToken(data.token);
    setUser(data.user);

    setTokenState(data.token);
    setUserState(data.user);

    return data;
  }

  function logout() {
    clearAuth();

    setTokenState(null);
    setUserState(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider.');
  }

  return context;
}