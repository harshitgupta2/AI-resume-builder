import { PDFParse } from "pdf-parse";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai/ai.service.js";
import InterviewReport from "../models/interviewReport.js";


/**
 * Generates an interview report for a candidate based on their resume, self-description, and job description.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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
/**
 * Fetches an interview report by its ID for the authenticated user.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getInterviewReportController = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReport.findOne({_id: interviewId, user: req.user._id});

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    } 
    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      data: interviewReport,
    });
  } catch (error) {
    console.error("getInterviewReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching interview report",
    });
  } 
};

/**
 * Fetches all interview reports for the authenticated user.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getAllInterviewReportsController = async (req, res) => {
  try {
const interviewReports = await InterviewReport.find({ user: req.user._id })
  .sort({ createdAt: -1 })
  .select("-resume -selfDescription -jobDescription -__v -techinalQuestions -behaviouralQuestions -skillGaps -preparationPlan");
    if (!interviewReports || interviewReports.length === 0) {
      return res.status(404).json({
        success: false, 
        message: "No interview reports found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      data: interviewReports,
    });
  } catch (error) {
    console.error("getAllInterviewReports error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching interview reports",
    });
  }
};

/**
 * @description Controller to generate Pdf 
 */
export const genratePdfController = async(req,res)=>{
  const{interviewReportId} = req.params


  const inteviewReport =  await InterviewReport.findById(interviewReportId);

  if(!inteviewReport){
    res.status(404).json({
      message:"Interview Report not found"
    })
  }
const {resume , jobDescription,selfDescription} = inteviewReport;
  const pdfBuffer = await generateResumePdf({resume,jobDescription,selfDescription})

  res.set({
    "Content-type":"application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
  })
  res.send(pdfBuffer)
}