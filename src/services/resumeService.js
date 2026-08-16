import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
export async function extractResumeText(file) {
  if (!file) throw Error("No resume selected.");
  if (file.type === "application/pdf") {
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((x) => x.str).join(" ") + "\n";
    }
    return text.trim();
  }
  if (file.type.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    });
    return result.value.trim();
  }
  throw Error("This file format cannot be parsed in the browser.");
}
