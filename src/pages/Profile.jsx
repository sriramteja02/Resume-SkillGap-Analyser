import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAnalyses } from "../utils/storage";
import Field from "../components/Field";
export default function Profile() {
  const { user } = useAuth();
  const analyses = getAnalyses(user);
  const latest = analyses[0];
  const [name, setName] = useState(user.name);
  const [experience, setExperience] = useState(user.experience || "Fresher");
  const completed = useMemo(
    () =>
      analyses.reduce(
        (n, a) =>
          n +
          (a.studyPlan || []).filter((x) => x.status === "Completed").length,
        0,
      ),
    [analyses],
  );
  const save = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("SkillGap_users") || "[]");
    localStorage.setItem(
      "SkillGap_users",
      JSON.stringify(
        users.map((u) => (u.id === user.id ? { ...u, name, experience } : u)),
      ),
    );
    localStorage.setItem(
      "SkillGap_session",
      JSON.stringify({ ...user, name, experience }),
    );
    location.reload();
  };
  return (
    <main className="page">
      <div className="page-head">
        <span className="eyebrow">PROFILE</span>
        <h1>Build your preparation identity.</h1>
      </div>
      <div className="profile-grid">
        <form className="panel" onSubmit={save}>
          <h2>Profile information</h2>
          <Field
            label="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="field">
            <label>Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option>Fresher</option>
              <option>Student</option>
              <option>Internship Experience</option>
              <option>0–1 years</option>
              <option>1–2 years</option>
              <option>2+ years</option>
            </select>
          </div>
          <button className="button primary">Save Changes</button>
        </form>
        <div className="profile-stats">
          <div>
            <span>Analyses</span>
            <strong>{analyses.length}</strong>
          </div>
          <div>
            <span>Completed Tasks</span>
            <strong>{completed}</strong>
          </div>
          <div>
            <span>Target Role</span>
            <strong>{latest?.targetRole || "Not set"}</strong>
          </div>
          <div>
            <span>Current Readiness</span>
            <strong>{latest ? `${latest.readinessScore}%` : "—"}</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
