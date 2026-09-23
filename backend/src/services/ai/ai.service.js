import Groq from "groq-sdk";
import puppeteer from "puppeteer";

import {
  interviewReportZodSchema,
  interviewReportJsonSchema,
} from "./interviewOutputSchema.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ----------------------------------------------------
// BUILD INTERVIEW REPORT PROMPT
// ----------------------------------------------------

const buildPrompt = ({
  resume,
  selfDescription,
  jobDescription,
}) => `
Generate the interview report for a candidate with the following details.

<job_description>
${jobDescription}
</job_description>

<resume>
${resume?.trim() || "Not provided."}
</resume>

<self_description>
${selfDescription?.trim() || "Not provided."}
</self_description>

Instructions:

1. Analyze the resume against the job description.
2. Generate a realistic match score from 0 to 100.
3. Generate technical interview questions.
4. Generate behavioral interview questions.
5. Identify skill gaps.
6. Assign skill gap severity as low, medium, or high.
7. Generate a practical preparation plan.
8. Do not invent candidate experience.
9. Keep questions relevant to the provided job description.
10. Return only the structured response.
`.trim();


// ----------------------------------------------------
// GENERATE INTERVIEW REPORT
// ----------------------------------------------------

const generateInterviewReport = async ({
  resume,
  jobDescription,
  selfDescription,
}) => {

  if (!jobDescription?.trim()) {
    throw new Error(
      "jobDescription is required to generate an interview report."
    );
  }

  const response = await groq.chat.completions.create({

    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: `
You are an expert technical recruiter
and interview preparation assistant.

Analyze candidates using only the provided
resume, job description and self-description.

Never invent experience or skills.

Return the response according to the
provided JSON schema.
        `.trim(),
      },

      {
        role: "user",
        content: buildPrompt({
          resume,
          selfDescription,
          jobDescription,
        }),
      },
    ],

    response_format: {
      type: "json_schema",

      json_schema: {
        name: "interview_report",

        strict: true,

        schema: interviewReportJsonSchema,
      },
    },
      max_completion_tokens: 10000,
      reasoning_effort: "low",

  });

  const raw =
    response.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error(
      "Groq returned an empty response."
    );
  }

  let parsed;

  try {

    parsed = JSON.parse(raw);

  } catch {

    throw new Error(
      `Groq returned invalid JSON (${raw.length} chars received).`
    );
  }

  // Validate with Zod
  return interviewReportZodSchema.parse(parsed);
};


// ----------------------------------------------------
// GENERATE PDF FROM HTML
// ----------------------------------------------------

const generatePdfFromHtml = async (htmlContent) => {

  const browser = await puppeteer.launch();

  try {

    const page = await browser.newPage();

    await page.setContent(
      htmlContent,
      {
        waitUntil: "networkidle2",
      }
    );

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;

  } finally {

    await browser.close();

  }
};


// ----------------------------------------------------
// GENERATE RESUME PDF
// ----------------------------------------------------

const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {

  const prompt = `
You are a world-class Executive Resume Designer
and Senior Technical Recruiter.

Transform the candidate's raw data into a targeted,
highly polished, single-page A4 HTML resume.

<job_description>
${jobDescription}
</job_description>

<resume>
${resume || "Not provided."}
</resume>

<self_description>
${selfDescription || "Not provided."}
</self_description>

CONTENT ALIGNMENT:

1. Write a strong 2-3 line targeted summary.

2. Rewrite experience bullet points using strong
action verbs and focus on job-relevant experience.

3. Quantify achievements only when the information
exists in the provided resume.

4. Categorize technical skills logically.

5. Do not invent skills, projects, experience,
companies or achievements.

FORMATTING:

@page {
  size: A4 portrait;
  margin: 0;
}

body {
  width: 210mm;
  height: 296mm;
  margin: 0 auto;
  padding: 12mm 15mm;
  box-sizing: border-box;
  overflow: hidden;
}

Base font:
9.5pt to 10pt

Line height:
1.35

h1:
18pt-20pt

h2:
11pt-12pt uppercase

Keep spacing compact.

OUTPUT:

Return ONLY raw HTML.

Start with:
<!DOCTYPE html>

End with:
</html>

Do not use Markdown code fences.

Do not return JSON.

Do not use external fonts.

Do not use external CSS.

Do not use external JavaScript.
`.trim();


  const response = await groq.chat.completions.create({

    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content:
          "You are an expert resume designer and senior technical recruiter.",
      },

      {
        role: "user",
        content: prompt,
      },
    ],
  });


  let htmlContent =
    response.choices?.[0]?.message?.content?.trim();


  if (!htmlContent) {
    throw new Error(
      "Groq returned an empty response."
    );
  }


  // Remove Markdown code fences
  htmlContent = htmlContent
    .replace(/^```html/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();


  return await generatePdfFromHtml(htmlContent);
};


export {
  generateInterviewReport,
  generateResumePdf,
};