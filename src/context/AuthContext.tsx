import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth';

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: unknown; // For any additional properties
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.getUser();
        setUser(response.data.user as User); // Explicit type casting
      } catch {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
