import { ExternalLink } from "lucide-react";
export default function ResourceCard({ r }) {
  return (
    <article className="resource-card">
      <div className="resource-top">
        <span>{r.skill}</span>
        <span>{r.type}</span>
      </div>
      <h3>{r.title}</h3>
      <p>{r.description}</p>
      <small>
        {r.source} · {r.difficulty}
      </small>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="button secondary"
      >
        Open Resource <ExternalLink size={15} />
      </a>
    </article>
  );
}
