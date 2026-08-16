import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAnalyses } from "../utils/storage";
import MatchScore from "../components/MatchScore";
import SkillCard from "../components/SkillCard";
import SkillChart from "../components/SkillChart";
import StudyPlan from "../components/StudyPlan";
import ResourceCard from "../components/ResourceCard";
import resources from "../data/resources.json";
export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const id = new URLSearchParams(loc.search).get("id");
  const analyses = getAnalyses(user);
  const a = analyses.find((x) => x.id === id) || analyses[0];
  const matched = a?.matchedSkills || [],
    missing = a?.missingSkills || [],
    weak = a?.weakSkills || [],
    extra = a?.extraSkills || [];
  const gapSkills = [...missing, ...weak];
  const filtered = useMemo(
    () =>
      resources.filter((r) =>
        gapSkills.some((s) => s.name.toLowerCase() === r.skill.toLowerCase()),
      ),
    [gapSkills],
  );
  if (!a)
    return (
      <main className="empty-page">
        <h1>No analysis available yet.</h1>
        <p>Run your first resume analysis to unlock the dashboard.</p>
        <button className="button primary" onClick={() => nav("/#analyzer")}>
          Analyze Your Resume
        </button>
      </main>
    );
  return (
    <main className="dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">ANALYSIS DASHBOARD</span>
          <h1>{a.targetRole || "Job Analysis"}</h1>
          <div className="source-label">
            Resume: {a.resumeFilename} · Source: {a.source}
          </div>
        </div>
        <button className="button secondary" onClick={() => nav("/#analyzer")}>
          <ArrowLeft size={16} /> New Analysis
        </button>
      </div>
      <div className="sticky-nav">
        <a href="#overview">Overview</a>
        <a href="#skills">Skills</a>
        <a href="#gaps">Skill Gaps</a>
        <a href="#study">Study Plan</a>
        <a href="#resources">Resources</a>
        <a href="#resume">Resume Suggestions</a>
      </div>
      <section id="overview" className="dash-section overview-grid">
        <MatchScore score={a.matchScore} />
        <div className="overview-copy">
          <span className="eyebrow">OVERALL JOB MATCH</span>
          <h2>
            Your resume matches {a.matchScore}% of the selected requirements.
          </h2>
          <p>
            Resume Match measures alignment with the target job. Job Readiness
            is a separate estimate of preparation based on demonstrated skills
            and gaps. Neither score is a hiring probability.
          </p>
          <div className="score-comparison">
            <div>
              <span>Resume Match</span>
              <strong>{a.matchScore}%</strong>
            </div>
            <div>
              <span>Job Readiness</span>
              <strong>{a.readinessScore}%</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="summary-grid">
        {[
          ["Matched Skills", matched.length],
          ["Missing Skills", missing.length],
          ["Weak Skills", weak.length],
          ["Extra Skills", extra.length],
          ["Job Readiness", `${a.readinessScore}%`],
        ].map(([t, v]) => (
          <div className="summary-card" key={t}>
            <span>{t}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </section>
      <section id="skills" className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">EVIDENCE</span>
          <h2>Skill match visualization</h2>
        </div>
        <SkillChart data={a.skillChart || []} />
      </section>
      <section className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">CATEGORIES</span>
          <h2>What your resume demonstrates</h2>
        </div>
        <div className="skill-groups">
          <div>
            <h3>
              <Check /> Matched Skills
            </h3>
            <div className="skill-list">
              {matched.map((s) => (
                <SkillCard key={s.name} skill={s} status="Matched" />
              ))}
            </div>
          </div>
          <div>
            <h3>
              <AlertTriangle /> Missing Skills
            </h3>
            <div className="skill-list">
              {missing.map((s) => (
                <SkillCard key={s.name} skill={s} status="Missing" />
              ))}
            </div>
          </div>
        </div>
        <div className="skill-columns">
          <div>
            <h3>Weak / Partial Skills</h3>
            {weak.length ? (
              weak.map((s) => (
                <div className="line-item" key={s.name}>
                  <span>{s.name}</span>
                  <small>{s.level}</small>
                </div>
              ))
            ) : (
              <p>No weak skills identified.</p>
            )}
          </div>
          <div>
            <h3>Extra Skills</h3>
            {extra.length ? (
              extra.map((s) => (
                <div className="line-item" key={s.name}>
                  <span>{s.name}</span>
                  <small>Not required · still useful</small>
                </div>
              ))
            ) : (
              <p>No extra skills identified.</p>
            )}
          </div>
        </div>
      </section>
      <section id="gaps" className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">PRIORITY</span>
          <h2>Skill gap table</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Status</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {gapSkills.concat(matched).map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>
                    <span
                      className={`status ${s.priority === "—" ? "present" : "missing"}`}
                    >
                      {s.priority === "—"
                        ? "Matched"
                        : s.priority === "Critical"
                          ? "Critical Gap"
                          : "Gap"}
                    </span>
                  </td>
                  <td>{s.level}</td>
                  <td>{s.requiredLevel || "—"}</td>
                  <td>
                    <span
                      className={`priority ${String(s.priority).toLowerCase()}`}
                    >
                      {s.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="study" className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">NEXT ACTIONS</span>
          <h2>Your Personalized Study Plan</h2>
          <p>
            Missing skills come first. Strongly demonstrated skills are not
            given study time.
          </p>
        </div>
        <StudyPlan
          plan={a.studyPlan || []}
          storageKey={`SkillGap_plan_${a.id}`}
        />
      </section>
      <section id="resources" className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">LEARN FOR FREE</span>
          <h2>Free Resources For Your Skill Gaps</h2>
        </div>
        <div className="resource-grid">
          {filtered.length ? (
            filtered.map((r) => <ResourceCard key={r.id} r={r} />)
          ) : (
            <div className="empty-box">
              No matching resources found. Try another skill or remove the
              filter.
            </div>
          )}
        </div>
      </section>
      <section id="resume" className="dash-section">
        <div className="section-heading compact">
          <span className="eyebrow">HONEST RESUME IMPROVEMENT</span>
          <h2>Improve Your Resume</h2>
        </div>
        <div className="suggestions">
          {(a.resumeSuggestions || []).map((s, i) => (
            <div key={i}>
              <Plus size={17} />
              <p>{s}</p>
            </div>
          ))}
          {!a.resumeSuggestions?.length && (
            <p>Your current analysis has no urgent resume suggestions.</p>
          )}
        </div>
        <div className="interview-box">
          <strong>Interview topics</strong>
          <div>
            {(a.interviewTopics || []).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
