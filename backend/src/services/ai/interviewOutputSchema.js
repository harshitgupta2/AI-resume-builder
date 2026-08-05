import { z } from "zod";

// --- Sub Schemas ---

const technicalQuestionSchema = z.object({
  questions: z
    .string()
    .describe("Technical question that can be asked in the interview."),
  intention: z
    .string()
    .describe(
      "The interviewer's underlying intention/goal behind asking this question."
    ),
  answer: z
    .string()
    .describe(
      "How to answer the question, including what points to cover and what technical approach to use."
    ),
});

const behaviouralQuestionSchema = z.object({
  questions: z
    .string()
    .describe("Behavioral question that can be asked in the interview."),
  intention: z
    .string()
    .describe(
      "The interviewer's underlying intention (e.g., testing teamwork, conflict resolution, ownership)."
    ),
  answer: z
    .string()
    .describe(
      "How to answer using frameworks like STAR (Situation, Task, Action, Result), key points to mention, and tone."
    ),
});

const skillGapSchema = z.object({
  skill: z
    .string()
    .describe("The specific skill, tool, or technology where a gap exists."),
  severity: z
    .enum(["low", "medium", "high"])
    .describe("The severity level of this skill gap for the target job role."),
});

const preparationPlanSchema = z.object({
  days: z
    .number()
    .describe("The day or time frame number for this section of the plan."),
  focus: z
    .string()
    .describe("Main focal area or objective for these preparation days."),
  tasks: z
    .array(z.string())
    .describe("Specific, actionable tasks or topics to study during this period."),
});

// --- Main Schema ---

export const interviewReportZodSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall percentage match score (0-100) between candidate profile and job description."),
  techinalQuestions: z
    .array(technicalQuestionSchema)
    .describe("List of potential technical questions, their intentions, and recommended answer approaches."),
  behaviouralQuestions: z
    .array(behaviouralQuestionSchema)
    .describe("List of potential behavioral questions, their intentions, and recommended answer approaches."),
  skillGaps: z
    .array(skillGapSchema)
    .describe("Identified skill gaps categorized by severity."),
  preparationPlan: z
    .array(preparationPlanSchema)
    .describe("Step-by-step preparation plan broken down into actionable days and tasks."),
});

// JSON Schema helper for Google GenAI SDK
export const interviewReportJsonSchema = z.toJSONSchema(interviewReportZodSchema);