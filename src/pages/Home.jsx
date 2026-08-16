import { useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  ChartNoAxesCombined,
  BookOpen,
  Target,
  Upload,
  ShieldCheck,
  Search,
} from "lucide-react";
import roles from "../data/roles.json";
import resources from "../data/resources.json";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Field from "../components/Field";
import ResumeUploader from "../components/ResumeUploader";
import LoadingAnalysis from "../components/LoadingAnalysis";
import { validateName, validateJD } from "../utils/validation";
import { extractResumeText } from "../services/resumeService";
import { analyzeResume } from "../services/aiService";
import { saveAnalysis } from "../utils/storage";
export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [experience, setExperience] = useState(user?.experience || "Fresher");
  const [mode, setMode] = useState("role");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const roleObj = roles.find((r) => r.name === role);
  const ready =
    !validateName(name) &&
    ((mode === "role" && role) || (mode === "jd" && !validateJD(jd))) &&
    file;
  const submit = async () => {
    setError("");
    if (!user) {
      nav("/login");
      return;
    }
    if (!ready) {
      setError("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const resumeText = await extractResumeText(file);
      const result = await analyzeResume({
        resumeText,
        targetRole: mode === "role" ? role : "",
        jobDescription:
          mode === "jd"
            ? jd
            : roleObj?.skills
                .map((s) => `${s.name} (${s.importance})`)
                .join(", "),
        experience,
      });
      const analysis = {
        ...result,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        resumeFilename: file.name,
        source: mode === "role" ? "Selected Role" : "Pasted Job Description",
      };
      saveAnalysis(user, analysis);
      nav(`/dashboard?id=${analysis.id}`);
    } catch (e) {
      setError(e.message || "We could not complete the analysis.");
    } finally {
      setLoading(false);
    }
  };
  const preview = useMemo(() => roleObj?.skills.slice(0, 6) || [], [roleObj]);
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">CAREER INTELLIGENCE FOR STUDENTS</span>
            <h1>
              Know Your Skill Gap.
              <br />
              <em>Prepare Smarter.</em>
              <br />
              Get Job Ready.
            </h1>
            <p>
              Compare your resume with a target role or real job description and
              get a clear path from skill gaps to a personalized study plan.
            </p>
            <div className="hero-actions">
              <a href="#analyzer" className="button primary">
                Analyze My Resume <ArrowRight size={17} />
              </a>
              <a href="#how-it-works" className="text-link">
                See how it works
              </a>
            </div>
            <div className="trust-row">
              <span>
                <ShieldCheck size={16} /> Honest skill analysis
              </span>
              <span>
                <BookOpen size={16} /> Free learning resources
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mini-dashboard">
              <div className="mini-head">
                <span>SkillGap Analysis</span>
                <span className="live-dot">Live</span>
              </div>
              <div className="mini-score">
                <div>
                  <small>Resume Match</small>
                  <strong>78%</strong>
                </div>
                <div className="mini-ring" />
              </div>
              <div className="mini-bars">
                {["React", "JavaScript", "REST APIs", "TypeScript"].map(
                  (x, i) => (
                    <div key={x}>
                      <span>{x}</span>
                      <div>
                        <i style={{ width: `${[95, 90, 75, 40][i]}%` }} />
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div className="mini-tags">
                <span>✓ React</span>
                <span>✓ JavaScript</span>
                <span>! TypeScript</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">THE LOOP</span>
            <h2>From uncertainty to a preparation plan.</h2>
          </div>
          <div className="steps">
            {[
              ["01", "Target the job", Target],
              ["02", "Upload your resume", Upload],
              ["03", "Analyze the gap", Brain],
              ["04", "Follow your plan", BookOpen],
            ].map(([n, t, I]) => (
              <div className="step" key={n}>
                <span>{n}</span>
                <I />
                <h3>{t}</h3>
                <p>
                  {
                    [
                      "Choose a role or paste the exact JD.",
                      "Use your current PDF or DOCX resume.",
                      "See matched, missing, weak and extra skills.",
                      "Learn only what your target role requires.",
                    ][Number(n) - 1]
                  }
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="section analyzer-section" id="analyzer">
          <div className="section-heading">
            <span className="eyebrow">SkillGap ANALYZER</span>
            <h2>Tell us where you're starting.</h2>
            <p>
              Your inputs drive the analysis. We never ask you to fake a skill
              you don't have.
            </p>
          </div>
          {loading ? (
            <LoadingAnalysis />
          ) : (
            <div className="analyzer-card">
              <div className="form-grid">
                <Field
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  error={validateName(name)}
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
              </div>
              <div className="source-toggle">
                <button
                  className={mode === "role" ? "active" : ""}
                  onClick={() => setMode("role")}
                >
                  Select Role
                </button>
                <button
                  className={mode === "jd" ? "active" : ""}
                  onClick={() => setMode("jd")}
                >
                  Paste Job Description
                </button>
              </div>
              {mode === "role" ? (
                <div className="field">
                  <label>Target Role</label>
                  <div className="search-select">
                    <Search size={17} />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Choose a role</option>
                      {roles.map((r) => (
                        <option key={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  {role && (
                    <div className="source-label">
                      Source: Selected Role · {roleObj?.skills.length}{" "}
                      requirements
                    </div>
                  )}
                </div>
              ) : (
                <div className="field">
                  <label>Job Description</label>
                  <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    onBlur={() => {}}
                    rows="7"
                    placeholder="Paste the complete job description here..."
                  />
                  {jd && (
                    <div className="source-label">
                      Source: Pasted Job Description
                    </div>
                  )}
                  {jd && validateJD(jd) && (
                    <span className="field-error">{validateJD(jd)}</span>
                  )}
                </div>
              )}
              <div className="field">
                <label>Resume</label>
                <ResumeUploader file={file} setFile={setFile} />
                {file && (
                  <div className="source-label">
                    Source: Uploaded Resume · {file.name}
                  </div>
                )}
              </div>
              {error && <div className="alert">{error}</div>}
              <button
                disabled={!ready}
                className="button primary full"
                onClick={submit}
              >
                Analyze My Resume <ArrowRight size={17} />
              </button>
              <p className="form-note">
                Your analysis is saved locally to your account. This demo does
                not provide secure backend authentication.
              </p>
            </div>
          )}
        </section>
        <section className="section why">
          <div className="section-heading">
            <span className="eyebrow">WHY SkillGap</span>
            <h2>Not another generic resume checker.</h2>
          </div>
          <div className="feature-grid">
            {[
              [
                "Resume Analysis",
                ChartNoAxesCombined,
                "See what your resume actually demonstrates.",
              ],
              [
                "Skill Gap Detection",
                Target,
                "Separate missing skills from weak ones.",
              ],
              [
                "Personalized Plan",
                BookOpen,
                "Know exactly what to learn first.",
              ],
              [
                "Free Resources",
                Brain,
                "Jump straight to legitimate learning sources.",
              ],
            ].map(([t, I, d]) => (
              <div className="feature-card" key={t}>
                <I />
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer>
        SkillGap · Career + AI + Analytics · Built as a frontend-first MVP
      </footer>
    </>
  );
}
