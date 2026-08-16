import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
const USERS = "SkillGap_users";
const SESSION = "SkillGap_session";
const read = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? f;
  } catch {
    return f;
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION, null));
  useEffect(() => {
    if (user) localStorage.setItem(SESSION, JSON.stringify(user));
    else localStorage.removeItem(SESSION);
  }, [user]);
  const register = ({ name, email, password, experience = "Fresher" }) => {
    const users = read(USERS, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw Error("An account with this email already exists.");
    const account = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      experience,
    };
    localStorage.setItem(USERS, JSON.stringify([...users, account]));
    const safe = { ...account, password: undefined };
    setUser(safe);
    return safe;
  };
  const login = (email, password) => {
    const users = read(USERS, []);
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!found) throw Error("Invalid email or password.");
    const safe = { ...found, password: undefined };
    setUser(safe);
    return safe;
  };
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
