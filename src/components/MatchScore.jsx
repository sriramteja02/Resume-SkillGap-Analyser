export default function MatchScore({ score, label = "JOB MATCH" }) {
  return (
    <div className="score-card">
      <div className="score-ring" style={{ "--score": `${score * 3.6}deg` }}>
        <div>
          <strong>{score}%</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}
