export const calculateScore = (matched, total) =>
  total ? Math.round((matched / total) * 100) : 0;
