import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until the first /auth/me resolves

  // Restore session on page load
  useEffect(() => {
    authApi
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Google access token -> backend session -> fetch user from /auth/me
  const loginWithGoogle = useCallback(async (accessToken) => {
    await authApi.googleLogin(accessToken);
    setUser(await authApi.getMe());
  }, []);

  const loginAsGuest = useCallback(async (email) => {
    await authApi.guestLogin(email);
    setUser(await authApi.getMe());
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, loginAsGuest, logout }),
    [user, loading, loginWithGoogle, loginAsGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
