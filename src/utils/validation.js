export const validateName = (v) => {
  if (!v?.trim()) return "Please enter your name.";
  if (v.trim().length < 2) return "Please enter at least 2 characters.";
  return "";
};
export const validateEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "")
    ? ""
    : "Enter a valid email address.";
export const validateJD = (v) =>
  v?.trim().length >= 30
    ? ""
    : "Please provide a more complete job description.";
export const validateFile = (f) => {
  if (!f) return "Please upload your resume.";
  const ok = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!ok.includes(f.type)) return "Please upload a PDF, DOC, or DOCX file.";
  if (f.size > 5 * 1024 * 1024) return "Resume must be smaller than 5 MB.";
  return "";
};
