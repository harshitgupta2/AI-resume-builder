import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";
import { z } from "zod";
import {
  interviewReportZodSchema,
  interviewReportJsonSchema,
} from "./interviewOutputSchema.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const buildPrompt = ({ resume, selfDescription, jobDescription }) => `
Generate the interview report for a candidate with the following details:

<job_description>
${jobDescription}
</job_description>

<resume>
${resume?.trim() || "Not provided."}
</resume>

<self_description>
${selfDescription?.trim() || "Not provided."}
</self_description>
`.trim();

const generateInterviewReport = async ({
  resume,
  jobDescription,
  selfDescription,
}) => {
  if (!jobDescription?.trim()) {
    throw new Error("jobDescription is required to generate an interview report.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: buildPrompt({ resume, selfDescription, jobDescription }),
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportJsonSchema,
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Gemini returned invalid JSON (${raw.length} chars received).`);
  }

  return interviewReportZodSchema.parse(parsed);
};

// Function to create a PDF from HTML content
const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle2" });

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};

const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
const prompt = `You are a world-class Executive Resume Designer and Senior Technical Recruiter. Your task is to transform the candidate's raw data into a targeted, highly polished, single-page A4 HTML resume tailored specifically to the job description.

<job_description>
${jobDescription}
</job_description>

<resume>
${resume}
</resume>

<self_description>
${selfDescription}
</self_description>

CONTENT ALIGNMENT REQUIREMENTS:
1. TARGETED SUMMARY: Write a strong 2-3 line professional summary using key terms and core qualifications requested in the job description.
2. TAILORED BULLET POINTS: Re-write work experience bullet points using strong action verbs. Quantify achievements where possible and prioritize responsibilities that match key requirements in the job description. Limit experience to 2–3 high-impact bullets per role.
3. SKILLS CATEGORIZATION: Group skills into logical categories (e.g., Core Competencies, Tools & Frameworks) and explicitly highlight skills mentioned in the job description.

STRICT SINGLE-PAGE PDF FORMATTING RULES:
1. PAGE SIZING: Include an inline <style> block with @page { size: A4 portrait; margin: 0; } and body { width: 210mm; height: 296mm; margin: 0 auto; padding: 12mm 15mm; box-sizing: border-box; overflow: hidden; }.
2. TYPOGRAPHY & SPACING:
   - Base font size: 9.5pt to 10pt with line-height of 1.35.
   - Headings: h1 (18pt-20pt), h2 (11pt-12pt uppercase with subtle bottom border).
   - Keep section margins tight (margin-bottom: 8px to 12px max).
   - Keep list items compact (margin-bottom: 2px to 3px max).
3. LAYOUT STRUCTURE: Use a clean modern layout (either 2-column sidebar or 1-column modular layout) engineered to fill 90-95% of the A4 height without spilling over into page 2.

OUTPUT CONSTRAINTS:
- Output ONLY valid raw HTML starting with <!DOCTYPE html> and ending with </html>.
- Do NOT wrap the response in JSON or Markdown code fences (\`\`\`html).
- Do NOT include external fonts or CSS scripts—all styling must be inline or inside a single <style> tag in the <head>.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  let htmlContent = response.text?.trim();

  if (!htmlContent) {
    throw new Error("Gemini returned an empty response.");
  }

  // Strip markdown code fences if Gemini accidentally wraps output in ```html ... ```
  htmlContent = htmlContent
    .replace(/^```html/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  // Pass raw HTML directly into Puppeteer
  const pdfBuffer = await generatePdfFromHtml(htmlContent);
  return pdfBuffer;
};

export { generateInterviewReport, generateResumePdf };