import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";

export default function GuestSignInButton({
  children = "Continue as Guest",
  ...buttonProps
}) {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleGuestLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await loginAsGuest();
      navigate("/app");
    } catch (err) {
      setError(err.message || "Guest sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleGuestLogin} loading={busy} {...buttonProps}>
        {children}
      </Button>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
