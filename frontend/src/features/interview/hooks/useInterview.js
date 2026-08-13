import { useContext } from "react";
import { InterviewContext } from "../context/interviewContext";
import {
  createInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf
} from "../services/api.js";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  // 1. Destructure from 'context', not 'useContext'
  // 2. Adjust setter casing (setLoading) to match standard React naming
  const {
    setLoading, // or setloading depending on your Context Provider definition
    setReport,
    setAllReports,
    loading,
    report,
    allReports,
  } = context;

  const generateReport = async ({
    resumeFile,
    jobdescription,
    selfdecription,
  }) => {
    setLoading?.(true);
    try {
      const response = await createInterviewReport({
        resumeFile,
        jobdescription,
        selfdecription,
      });

      if (response?.data) {
        setReport(response.data);
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error generating interview report:", error);
      throw error;
    } finally {
      setLoading?.(false);
    }
  };

  const getReportById = async (reportId) => {
    if (!reportId) {
      throw new Error("Report ID is required");
    }

    setLoading?.(true);
    try {
      const response = await getInterviewReportById(reportId);
      if (response?.data) {
        setReport(response.data);
      }
    } catch (error) {
      console.error("Error fetching report by ID:", error);
    } finally {
      setLoading?.(false);
    }
  };

  const getAllReport = async () => {
    setLoading?.(true);
    try {
      const response = await getAllInterviewReports();
      if (response) {
        setAllReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching all reports:", error);
    } finally {
      setLoading?.(false);
    }
  };

  const getResumePdf = async(interviewReportId)=>{
    setLoading(true);
    let response = null
   try {
    response = await generateResumePdf({interviewReportId}) 
    console.log("from hooks line 93", response);
    const url = window.URL.createObjectURL(new Blob([response],{type:"application/pdf"}))
    const link = document.createElement("a");
    link.href = url
    link.setAttribute("download",`resume_${interviewReportId}.pdf`)
    document.body.appendChild(link);
    link.click()
   } catch (error) {
    console.log(error)
   }finally{
    setLoading(false)
   }
  }

  return {
    loading,
    generateReport,
    getReportById,
    getAllReport,
    report,
    allReports,
    getResumePdf
  };
};