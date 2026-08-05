import { GoogleGenAI } from "@google/genai";
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

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: buildPrompt({ resume, selfDescription, jobDescription }),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: interviewReportJsonSchema,
    },
    // Resumes are personal data. Opt out of the 55-day server-side retention.
    store: false,
  });

  const raw = interaction.output_text;
  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Almost always a truncated response — the report is long.
    throw new Error(`Gemini returned invalid JSON (${raw.length} chars received).`);
  }

  // Schema-compliant JSON is not the same as semantically valid data.
 const response = interviewReportZodSchema.parse(parsed)
return response;
 


};

export default generateInterviewReport;