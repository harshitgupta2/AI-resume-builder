import { PDFParse } from "pdf-parse";
import  generateInterviewReport  from "../services/ai/ai.service.js";
import InterviewReport from "../models/interviewReport.js";

export const generateInterviewReportController = async (req, res) => {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    if (resumeFile.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are supported",
      });
    }

    // --- PDF parsing ---
    let resumeContent = "";
    const parser = new PDFParse({ data: resumeFile.buffer });

    try {
      const result = await parser.getText();
      resumeContent = (result.text ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
    } catch (err) {
      console.error("PDF parse failed:", err);
      return res.status(400).json({
        success: false,
        message: "Could not read this PDF. It may be corrupted or password-protected.",
      });
    } finally {
      await parser.destroy();
    }

    if (resumeContent.length < 100) {
      return res.status(422).json({
        success: false,
        message:
          "No readable text found. If this is a scanned resume, please upload a text-based PDF.",
      });
    }
    // --- end PDF parsing ---

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      ...interviewReportByAi,
      user: req.user._id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      data: interviewReport,
    });
  } catch (error) {
    console.error("generateInterviewReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating interview report",
    });
  }
};