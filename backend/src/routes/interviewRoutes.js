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




export default interviewRouter;