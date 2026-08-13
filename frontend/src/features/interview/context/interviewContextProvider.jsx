import { InterviewContext } from "./interviewContext";
import { useState } from "react";

export const InterviewContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState([]);

  return (
    <InterviewContext.Provider
      value={{
        loading,
        setLoading,
        report,
        setReport,
        allReports,
        setAllReports,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
