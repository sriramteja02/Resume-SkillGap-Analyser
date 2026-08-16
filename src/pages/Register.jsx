import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Field from "../components/Field";
import { validateEmail, validateName } from "../utils/validation";
export default function Register() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    experience: "Fresher",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) nav("/dashboard", { replace: true });
  }, [user, nav]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (validateName(form.name) || validateEmail(form.email)) {
      setError("Please fix the highlighted fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    try {
      register(form);
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">START WITH YOUR GAP</span>
        <h1>Create your SkillGap account.</h1>
        <p>Your data stays in localStorage in this frontend demo.</p>
        <form onSubmit={submit}>
          <Field
            label="Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            error={validateName(form.name)}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            error={form.email ? validateEmail(form.email) : ""}
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 6 characters"
          />
          <div className="field">
            <label>Experience Level</label>
            <select value={form.experience} onChange={set("experience")}>
              <option>Fresher</option>
              <option>Student</option>
              <option>Internship Experience</option>
              <option>0–1 years</option>
              <option>1–2 years</option>
              <option>2+ years</option>
            </select>
          </div>
          {error && <div className="alert">{error}</div>}
          <button className="button primary full">Create Account</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
