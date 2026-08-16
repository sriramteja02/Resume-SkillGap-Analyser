import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Field from "../components/Field";
export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) nav("/dashboard", { replace: true });
  }, [user, nav]);
  const submit = (e) => {
    e.preventDefault();
    try {
      login(email, password);
      nav(loc.state?.from || "/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Continue your preparation.</h1>
        <p>Sign in to access saved analyses and progress.</p>
        <form onSubmit={submit}>
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && <div className="alert">{error}</div>}
          <button className="button primary full">Login</button>
        </form>
        <p>
          New to SkillGap? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
