import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from 'react';
  import {
    login as apiLogin,
    logout as apiLogout,
    refresh as apiRefresh,
    register as apiRegister,
    setAccessToken,
    type User,
  } from '../lib/api';
  
  type AuthContextValue = {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
      email: string;
      name?: string;
      password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
  };
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    function saveSession(nextUser: User | null, nextToken: string | null) {
      setUser(nextUser);
      setToken(nextToken);
      setAccessToken(nextToken);
    }
  
    useEffect(() => {
      async function restoreSession() {
        try {
          const result = await apiRefresh();
          saveSession(result.user, result.accessToken);
        } catch {
          saveSession(null, null);
        } finally {
          setLoading(false);
        }
      }
  
      restoreSession();
    }, []);
  
    async function login(email: string, password: string) {
      const result = await apiLogin({ email, password });
      saveSession(result.user, result.accessToken);
    }
  
    async function register(data: {
      email: string;
      name?: string;
      password: string;
    }) {
      await apiRegister(data);
      const result = await apiLogin({
        email: data.email,
        password: data.password,
      });
      saveSession(result.user, result.accessToken);
    }
  
    async function logout() {
      try {
        await apiLogout();
      } finally {
        saveSession(null, null);
      }
    }
  
    const value = useMemo(
      () => ({
        user,
        accessToken: token,
        loading,
        login,
        register,
        logout,
      }),
      [user, token, loading],
    );
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  export function useAuth() {
    const ctx = useContext(AuthContext);
  
    if (!ctx) {
      throw new Error('useAuth must be used inside AuthProvider');
    }
  
    return ctx;
  }