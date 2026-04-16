import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import authService, { type AccountType, type LoginRequest, type SignUpRequest } from "../../services/authService";

type AuthContextType = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignUpRequest, type: AccountType) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      await authService.refresh();

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(authService.isSessionValidB());
      setIsBootstrapping(false);
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isBootstrapping,
      login: async (data: LoginRequest) => {
        await authService.login(data);
        setIsAuthenticated(authService.isSessionValidB());
      },
      signup: async (data: SignUpRequest, type: AccountType) => {
        await authService.register(data, type);
        // After successful registration, login automatically
        await authService.login(data);
        setIsAuthenticated(authService.isSessionValidB());
      },
      logout: () => {
        authService.clearToken();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

