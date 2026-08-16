export const flattenSkills = (a) => [
  ...(a?.matchedSkills || []),
  ...(a?.missingSkills || []),
  ...(a?.weakSkills || []),
  ...(a?.extraSkills || []),
];
