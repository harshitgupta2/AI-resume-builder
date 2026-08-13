import {Router} from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as interviewController from '../controller/interviewController.js'
import upload from "../middleware/fileMiddleware.js"


const interviewRouter  = Router();



/**
 * @route POST /api/interview
 * @desc Generate an interview report for a candidate based on their resume, self-description, and job description.
 * @access private
 */
interviewRouter.post("/",authMiddleware,upload.single('resume'),interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Fetch an interview report by its ID for the authenticated user.
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware,interviewController.getInterviewReportController);
    
/**
 * @route GET /api/interview/reports/all
 * @desc Fetch all interview reports for the authenticated user.
 * @access private
 */
interviewRouter.get("/reports/all",authMiddleware,interviewController.getAllInterviewReportsController);

interviewRouter.post("/resume/pdf/:interviewReportId",authMiddleware,interviewController.genratePdfController )



export default interviewRouter;