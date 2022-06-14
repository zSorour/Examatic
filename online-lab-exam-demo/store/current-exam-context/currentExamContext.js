import { createContext } from "react";

//We actually fill the create exam context with dummy data even for the functions only for better code completion and intellisense, etc.
const CurrentExamContext = createContext({
  examID: "",
  instanceIP: "",
  tempPassword: "",
  setCurrentExam: (examID, instanceIP, tempPassword) => {},
  clearCurrentExam: () => {}
});

export default CurrentExamContext;
