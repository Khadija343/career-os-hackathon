import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";
import { register } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

// Maps backend/network failures to a single user-facing message.
function getSignupErrorMessage(err) {
  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 409) {
    return data?.message || "An account with this email already exists.";
  }

  if (status === 400 && Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((issue) => issue.message).join(" ");
  }

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return data?.message || "Registration failed. Please try again.";
}

function Signup() {
  const navigate = useNavigate();
  const { login: setAuthenticatedUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const { password } = formData;

    if (!fullName || !email || !password) {
      setError("Please fill in all fields to create your account.");
      return;
    }

    if (fullName.length < 3) {
      setError("Full name must be at least 3 characters.");
      return;
    }

    if (password.length < 8 || !PASSWORD_RULE.test(password)) {
      setError("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.");
      return;
    }

    setLoading(true);

    try {
      const result = await register({ fullName, email, password });
      const { user, token } = result?.data || {};

      if (token) {
        // Backend returned a JWT on registration: log the user in immediately.
        setAuthenticatedUser(user, token);
        setSuccess("Account created successfully! Redirecting...");
        navigate("/dashboard", { replace: true });
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      window.setTimeout(() => navigate("/login", { replace: true }), 600);
    } catch (err) {
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignup() {
    localStorage.removeItem("token");
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Google User", email: "google.user@example.com" })
    );
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md space-y-5 border border-slate-700/70 bg-slate-900/70 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="mb-2 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
            Career OS
          </div>
          <PageTitle title="Create your account" />
          <p className="text-sm text-slate-400">Start building a stronger professional profile today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
          {success ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{success}</p> : null}
          <Input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} disabled={loading} />
          <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={loading} />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} disabled={loading} />
          <Button text={loading ? "Creating account..." : "Create Account"} type="submit" className="w-full" disabled={loading} />
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-slate-100 transition duration-200 hover:border-blue-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </Card>
    </div>
  );
}

export default Signup;