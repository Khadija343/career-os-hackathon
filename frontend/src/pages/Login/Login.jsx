import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

// Maps backend/network failures to a single user-facing message.
function getLoginErrorMessage(err) {
  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400 && Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((issue) => issue.message).join(" ");
  }

  if (status === 401) {
    return data?.message || "Invalid email or password.";
  }

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return data?.message || "Login failed. Please try again.";
}

function Login() {
  const navigate = useNavigate();
  const { login: setAuthenticatedUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email.trim(), password);
      const { user, token } = result?.data || {};

      if (!token) {
        throw new Error("Malformed login response from server.");
      }

      setAuthenticatedUser(user, token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <PageTitle title="Welcome back" />
        <p className="text-sm text-slate-400">Sign in to continue your career growth journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        <Button text={loading ? "Signing in..." : "Login"} type="submit" className="w-full" disabled={loading} />
      </form>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
        <Link to="/signup" className="hover:text-white">Create account</Link>
      </div>
    </Card>
  );
}

export default Login;