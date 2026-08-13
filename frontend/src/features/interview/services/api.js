import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ai-resume-builder-7a3u.onrender.com/api",
  withCredentials: true,
});

// Normalize an axios error into a plain Error carrying the backend message.
const toError = (error, fallback) =>
  new Error(error?.response?.data?.message || error?.message || fallback);

/**
 * Generate an interview report from the resume PDF, job description and self description.
 * Field names must match the backend: upload.single("resume") + req.body.{jobDescription,selfDescription}.
 * @returns {Promise<{success:boolean, message:string, data:object}>}
 */
export const createInterviewReport = async ({
  resumeFile,
  jobDescription,
  selfDescription,
}) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  try {
    // Let axios set the multipart boundary automatically.
    const response = await api.post("/interview/", formData);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to generate interview report");
  }
};

/**
 * Fetch a single interview report by its id.
 * @returns {Promise<{success:boolean, message:string, data:object}>}
 */
export const getInterviewReportById = async (reportId) => {
  try {
    const response = await api.get(`/interview/report/${reportId}`);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch interview report");
  }
};

/**
 * Fetch all interview reports for the authenticated user.
 * @returns {Promise<{success:boolean, message:string, data:object[]}>}
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/interview/reports/all");
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch interview reports");
  }
};


/**
 * @description Service to genrate pdf on the basis of resume,jobDesciption and selfDesciption 
 */

export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.post(
      `/interview/resume/pdf/${interviewReportId}`,null,
      { responseType: "blob" }
    );
    console.log("from api service:", response)
    return response.data;
  } catch (error) {
    // ✅ Attaches the caught error as the cause
    throw new Error("Failed to generate resume PDF", { cause: error });
  }
};
