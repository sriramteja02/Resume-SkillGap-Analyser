const key = (u) => `SkillGap_analyses_${u?.id || "guest"}`;
export const getAnalyses = (u) => {
  try {
    return JSON.parse(localStorage.getItem(key(u))) || [];
  } catch {
    return [];
  }
};
export const saveAnalysis = (u, a) => {
  const next = [a, ...getAnalyses(u)].slice(0, 20);
  localStorage.setItem(key(u), JSON.stringify(next));
  return next;
};
export const getAnalysis = (u, id) => getAnalyses(u).find((a) => a.id === id);
