import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const signout = () => {
    logout();
    close();
    nav("/");
  };
  return (
    <header className="navbar">
      <Link className="brand" to="/" onClick={close}>
        <span className="brand-mark">S</span> SkillGap
      </Link>
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/" onClick={close}>
          Home
        </NavLink>
        <a href="/#how-it-works" onClick={close}>
          How It Works
        </a>
        {user && (
          <>
            <NavLink to="/dashboard" onClick={close}>
              Dashboard
            </NavLink>
            <NavLink to="/history" onClick={close}>
              History
            </NavLink>
            <NavLink to="/profile" onClick={close}>
              Profile
            </NavLink>
          </>
        )}
        {user ? (
          <button className="nav-logout" onClick={signout}>
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <NavLink className="nav-cta" to="/login" onClick={close}>
            Login / Register
          </NavLink>
        )}
      </nav>
    </header>
  );
}
