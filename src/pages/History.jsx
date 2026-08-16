import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAnalyses } from "../utils/storage";
import { ArrowRight, Trash2 } from "lucide-react";
export default function History() {
  const { user } = useAuth();
  const items = getAnalyses(user);
  const remove = (id) => {
    const next = items.filter((x) => x.id !== id);
    localStorage.setItem(`SkillGap_analyses_${user.id}`, JSON.stringify(next));
    location.reload();
  };
  return (
    <main className="page">
      <div className="page-head">
        <span className="eyebrow">YOUR JOURNEY</span>
        <h1>Analysis History</h1>
        <p>Return to previous analyses and continue the preparation plan.</p>
      </div>
      {items.length ? (
        <div className="history-list">
          {items.map((a) => (
            <article className="history-card" key={a.id}>
              <div>
                <span className="eyebrow">
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <h2>{a.targetRole}</h2>
                <p>
                  {a.resumeFilename} · {a.source}
                </p>
              </div>
              <div className="history-score">
                {a.matchScore}% <small>Match</small>
              </div>
              <Link className="button secondary" to={`/dashboard?id=${a.id}`}>
                Open <ArrowRight size={15} />
              </Link>
              <button
                className="icon-btn"
                title="Delete analysis"
                onClick={() => remove(a.id)}
              >
                <Trash2 />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-box">
          <h2>No analysis available yet.</h2>
          <p>Analyze a resume and your results will appear here.</p>
          <Link className="button primary" to="/#analyzer">
            Analyze Your Resume
          </Link>
        </div>
      )}
    </main>
  );
}
