import roles from "../data/roles.json";
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
const aliases = {
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],
  react: ["react", "reactjs", "react.js"],
  "rest apis": ["rest api", "rest apis", "api integration"],
  "responsive design": ["responsive", "responsive design"],
  testing: ["testing", "jest", "unit testing", "react testing"],
  github: ["github"],
  git: ["git", "git version control"],
  html: ["html"],
  css: ["css"],
  "node.js": ["node.js", "nodejs", "node"],
  python: ["python"],
  java: ["java"],
  sql: ["sql"],
  docker: ["docker"],
  linux: ["linux"],
  "ci/cd": ["ci/cd", "cicd", "continuous integration"],
  cloud: ["cloud", "aws", "azure", "gcp"],
  kubernetes: ["kubernetes", "k8s"],
  "data structures": ["data structures", "dsa"],
  algorithms: ["algorithms", "algorithm"],
  excel: ["excel"],
  statistics: ["statistics"],
  "data visualization": ["data visualization", "tableau", "power bi"],
  "power bi": ["power bi"],
  selenium: ["selenium"],
  "test cases": ["test case", "test cases"],
  "api testing": ["api testing"],
};
const has = (text, skill) => {
  const t = norm(text);
  return (aliases[skill.toLowerCase()] || [skill.toLowerCase()]).some((a) =>
    t.includes(norm(a)),
  );
};
function localAnalysis({ resumeText, jobDescription, targetRole, experience }) {
  const role = roles.find((r) => r.name === targetRole);
  const requirements = role?.skills || [];
  const matched = [],
    missing = [],
    weak = [];
  requirements.forEach((s, i) => {
    if (has(resumeText, s.name)) {
      matched.push({
        name: s.name,
        level: "Intermediate",
        requiredLevel:
          s.importance === "critical" ? "Advanced" : "Intermediate",
        priority: "—",
        score: 80 + (i % 3) * 5,
      });
    } else {
      missing.push({
        name: s.name,
        level: "Beginner",
        requiredLevel:
          s.importance === "critical" ? "Advanced" : "Intermediate",
        priority:
          s.importance === "critical"
            ? "Critical"
            : s.importance === "high"
              ? "High"
              : "Medium",
        score: 10 + (i % 3) * 8,
      });
    }
  });
  const common = [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Python",
    "SQL",
    "Git",
    "GitHub",
    "TypeScript",
    "Docker",
    "Figma",
    "Java",
  ];
  const extra = common
    .filter(
      (s) =>
        has(resumeText, s) &&
        !requirements.some((r) => r.name.toLowerCase() === s.toLowerCase()),
    )
    .map((s) => ({ name: s, level: "Intermediate", score: 60 }));
  const score = requirements.length
    ? Math.round((matched.length / requirements.length) * 100)
    : 50;
  const readiness = Math.max(
    0,
    Math.round(score * 0.8 + (experience === "Fresher" ? 5 : 10)),
  );
  const gaps = [...missing, ...weak].sort(
    (a, b) =>
      (({ Critical: 0, High: 1, Medium: 2, Low: 3 })[a.priority] ?? 2) -
      ({ Critical: 0, High: 1, Medium: 2, Low: 3 }[b.priority] ?? 2),
  );
  const studyPlan = gaps
    .slice(0, 8)
    .flatMap((s, i) => [
      {
        day: i + 1,
        skill: s.name,
        topic: `${s.name} fundamentals`,
        task: "Learn + Practice",
        priority: s.priority,
        status: "Not Started",
      },
      {
        day: i + 2,
        skill: s.name,
        topic: `${s.name} practical exercise`,
        task: "Practice",
        priority: s.priority,
        status: "Not Started",
      },
    ])
    .slice(0, 10);
  return {
    matchScore: score,
    readinessScore: readiness,
    matchedSkills: matched,
    missingSkills: missing,
    weakSkills: weak,
    extraSkills: extra,
    skillChart: [...matched, ...missing].map((s) => ({
      name: s.name,
      score: s.score,
    })),
    studyPlan,
    resumeSuggestions: missing
      .slice(0, 4)
      .map(
        (s) =>
          `If you genuinely know ${s.name}, add a project or experience that demonstrates it.`,
      ),
    interviewTopics: gaps.slice(0, 5).map((s) => s.name),
    source: targetRole ? "Selected Role" : "Pasted Job Description",
    targetRole: targetRole || "Custom Job Description",
  };
}
export async function analyzeResume(input) {
  const url = import.meta.env.VITE_AI_API_URL;
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  if (url) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw Error("AI analysis service is unavailable.");
    const data = await response.json();
    if (
      typeof data.matchScore !== "number" ||
      !Array.isArray(data.matchedSkills) ||
      !Array.isArray(data.missingSkills)
    )
      throw Error("The AI returned an invalid analysis.");
    return data;
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve(localAnalysis(input)), 1400),
  );
}
