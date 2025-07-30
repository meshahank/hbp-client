import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId: number;
    
    const initAuth = async () => {
      try {
        const savedToken = authService.getToken();
        const savedUser = authService.getUser();
        
        console.log('Auth init - saved token exists:', !!savedToken);
        console.log('Auth init - saved user exists:', !!savedUser);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
          
          // Verify token is still valid by making an API call
          try {
            console.log('Verifying token with API call...');
            const profile = await authService.getProfile();
            console.log('Token verification successful, profile:', profile);
            setUser(profile);
            authService.setUser(profile);
          } catch (error) {
            // Token is invalid, logout silently
            console.log('Token expired or invalid, logging out:', error);
            authService.logout();
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('No saved token or user found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set a timeout to ensure loading doesn't get stuck
    timeoutId = window.setTimeout(() => {
      console.log('Auth initialization timeout, setting loading to false');
      setIsLoading(false);
    }, 10000); // 10 second timeout (increased from 5 seconds)

    initAuth().then(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    authService.setToken(newToken);
    authService.setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
