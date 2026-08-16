import { Check } from "lucide-react";
import { useEffect, useState } from "react";
const steps = [
  "Reading resume",
  "Identifying technical skills",
  "Understanding experience",
  "Comparing with job requirements",
  "Finding skill gaps",
  "Building study plan",
  "Finding learning resources",
];
export default function LoadingAnalysis() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setN((x) => Math.min(x + 1, steps.length - 1)),
      550,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="analysis-loader">
      <div className="spinner" />
      <h1>Analyzing Your Resume...</h1>
      <p>SkillGap is building your personalized preparation path.</p>
      <div className="loader-steps">
        {steps.map((s, i) => (
          <div key={s} className={i < n ? "done" : i === n ? "active" : ""}>
            <span>{i < n ? <Check size={15} /> : i === n ? "●" : "○"}</span>
            {s}
          </div>
        ))}
      </div>
      <div className="progress">
        <span style={{ width: `${((n + 1) / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}
