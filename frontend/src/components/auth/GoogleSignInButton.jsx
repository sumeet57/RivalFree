import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";

// Google access token -> POST /api/auth/google (via AuthContext) -> dashboard.
export default function GoogleSignInButton({ children = "Continue with Google", ...buttonProps }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      setBusy(true);
      setError(null);
      try {
        await loginWithGoogle(res.access_token);
        navigate("/app");
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed"),
  });

  return (
    <div className="space-y-2">
      <Button onClick={() => login()} loading={busy} {...buttonProps}>{children}</Button>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
