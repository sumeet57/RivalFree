import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ErrorText from "../components/ui/ErrorText";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      setBusy(true);
      try {
        await loginWithGoogle(res.access_token); // -> POST /api/auth/google
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed"),
  });

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Rival<span className="text-signal">Free</span>
        </h1>
        <p className="mt-2 text-muted">
          Describe your product. Agents scan the live web for competitors and find the features nobody has built yet.
        </p>
      </div>
      <Button onClick={() => googleLogin()} loading={busy} className="py-3">
        Continue with Google
      </Button>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
