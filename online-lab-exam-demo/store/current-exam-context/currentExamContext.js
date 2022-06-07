import { createContext } from "react";

//We actually fill the create exam context with dummy data even for the functions only for better code completion and intellisense, etc.
const CurrentExamContext = createContext({
  instanceIP: "",
  tempPassword: "",
  setCurrentExam: (instanceIP, tempPassword) => {},
  clearCurrentExam: () => {}
});

export default CurrentExamContext;
