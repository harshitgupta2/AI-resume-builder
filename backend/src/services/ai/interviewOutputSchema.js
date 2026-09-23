import { z } from "zod";

// ----------------------------------------------------
// TECHNICAL QUESTION
// ----------------------------------------------------

const technicalQuestionSchema = z.object({
  questions: z
    .string()
    .describe(
      "Concise technical question relevant to the target job."
    ),

  intention: z
    .string()
    .describe(
      "Interviewer's intention. Keep it under 12 words."
    ),

  answer: z
    .string()
    .describe(
      "Concise recommended answer. Keep it under 45 words."
    ),
});


// ----------------------------------------------------
// BEHAVIOURAL QUESTION
// ----------------------------------------------------

const behaviouralQuestionSchema = z.object({
  questions: z
    .string()
    .describe(
      "Concise behavioral question relevant to the target job."
    ),

  intention: z
    .string()
    .describe(
      "Interviewer's intention. Keep it under 12 words."
    ),

  answer: z
    .string()
    .describe(
      "Concise recommended answer. Keep it under 45 words."
    ),
});


// ----------------------------------------------------
// SKILL GAP
// ----------------------------------------------------

const skillGapSchema = z.object({
  skill: z
    .string()
    .describe(
      "Specific relevant skill gap. Keep it concise."
    ),

  severity: z
    .enum(["low", "medium", "high"])
    .describe(
      "Severity of the skill gap."
    ),
});


// ----------------------------------------------------
// PREPARATION PLAN
// ----------------------------------------------------

const preparationPlanSchema = z.object({
  days: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe(
      "Preparation day number from 1 to 5."
    ),

  focus: z
    .string()
    .describe(
      "Main topic for this preparation day. Keep it concise."
    ),

  tasks: z
    .array(z.string())
    .length(2)
    .describe(
      "Exactly 2 short actionable tasks."
    ),
});


// ----------------------------------------------------
// MAIN ZOD SCHEMA
// ----------------------------------------------------

export const interviewReportZodSchema = z.object({

  jobTitle: z
    .string()
    .describe(
      "Target job title from the job description."
    ),

  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall candidate match score from 0 to 100."
    ),

  techinalQuestions: z
    .array(technicalQuestionSchema)
    .length(5)
    .describe(
      "Exactly 5 technical interview questions."
    ),

  behaviouralQuestions: z
    .array(behaviouralQuestionSchema)
    .length(3)
    .describe(
      "Exactly 3 behavioral interview questions."
    ),

  skillGaps: z
    .array(skillGapSchema)
    .length(3)
    .describe(
      "Exactly 3 relevant skill gaps."
    ),

  preparationPlan: z
    .array(preparationPlanSchema)
    .length(5)
    .describe(
      "Exactly 5 preparation days."
    ),
});


// ----------------------------------------------------
// GROQ JSON SCHEMA
// ----------------------------------------------------

export const interviewReportJsonSchema = {
  type: "object",

  properties: {

    // ------------------------------------------------
    // JOB TITLE
    // ------------------------------------------------

    jobTitle: {
      type: "string",
      description:
        "Target job title from the job description.",
    },


    // ------------------------------------------------
    // MATCH SCORE
    // ------------------------------------------------

    matchScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "Overall candidate match score from 0 to 100.",
    },


    // ------------------------------------------------
    // TECHNICAL QUESTIONS
    // ------------------------------------------------

    techinalQuestions: {
      type: "array",

      minItems: 5,
      maxItems: 5,

      items: {
        type: "object",

        properties: {

          questions: {
            type: "string",
            description:
              "Concise technical question relevant to the target job.",
          },

          intention: {
            type: "string",
            description:
              "Interviewer's intention. Keep it under 12 words.",
          },

          answer: {
            type: "string",
            description:
              "Concise recommended answer. Keep it under 45 words.",
          },
        },

        required: [
          "questions",
          "intention",
          "answer",
        ],

        additionalProperties: false,
      },
    },


    // ------------------------------------------------
    // BEHAVIOURAL QUESTIONS
    // ------------------------------------------------

    behaviouralQuestions: {
      type: "array",

      minItems: 3,
      maxItems: 3,

      items: {
        type: "object",

        properties: {

          questions: {
            type: "string",
            description:
              "Concise behavioral question relevant to the target job.",
          },

          intention: {
            type: "string",
            description:
              "Interviewer's intention. Keep it under 12 words.",
          },

          answer: {
            type: "string",
            description:
              "Concise recommended answer. Keep it under 45 words.",
          },
        },

        required: [
          "questions",
          "intention",
          "answer",
        ],

        additionalProperties: false,
      },
    },


    // ------------------------------------------------
    // SKILL GAPS
    // ------------------------------------------------

    skillGaps: {
      type: "array",

      minItems: 3,
      maxItems: 3,

      items: {
        type: "object",

        properties: {

          skill: {
            type: "string",
            description:
              "Specific relevant skill gap. Keep it concise.",
          },

          severity: {
            type: "string",

            enum: [
              "low",
              "medium",
              "high",
            ],

            description:
              "Severity of the skill gap.",
          },
        },

        required: [
          "skill",
          "severity",
        ],

        additionalProperties: false,
      },
    },


    // ------------------------------------------------
    // PREPARATION PLAN
    // ------------------------------------------------

    preparationPlan: {
      type: "array",

      minItems: 5,
      maxItems: 5,

      items: {
        type: "object",

        properties: {

          days: {
            type: "number",
            minimum: 1,
            maximum: 5,
            description:
              "Preparation day number from 1 to 5.",
          },

          focus: {
            type: "string",
            description:
              "Main topic for this preparation day. Keep it concise.",
          },

          tasks: {
            type: "array",

            minItems: 2,
            maxItems: 2,

            items: {
              type: "string",
            },

            description:
              "Exactly 2 short actionable tasks.",
          },
        },

        required: [
          "days",
          "focus",
          "tasks",
        ],

        additionalProperties: false,
      },
    },
  },


  // ------------------------------------------------
  // REQUIRED FIELDS
  // ------------------------------------------------

  required: [
    "jobTitle",
    "matchScore",
    "techinalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan",
  ],

  additionalProperties: false,
};