import { Check, AlertTriangle } from "lucide-react";
export default function SkillCard({ skill, status }) {
  const missing = status === "Missing";
  return (
    <div className={`skill-card ${missing ? "missing" : "matched"}`}>
      <div className="skill-icon">
        {missing ? <AlertTriangle size={17} /> : <Check size={17} />}
      </div>
      <div>
        <strong>{skill.name}</strong>
        <span>{missing ? "Missing from Resume" : "Present in Resume"}</span>
      </div>
    </div>
  );
}
