import CurrentExamContext from "./currentExamContext";

import { useState, useEffect } from "react";

function CurrentExamProvider({ children }) {
  const [examID, setExamID] = useState("");
  const [instanceIP, setInstanceIP] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const currentExamContext = {
    examID: examID,
    instanceIP: instanceIP,
    tempPassword: tempPassword,
    setCurrentExam: (examID, ip, tempPass) => {
      setExamID(examID);
      setInstanceIP(ip);
      setTempPassword(tempPass);

      //   localStorage.setItem(
      //     "currentExam",
      //     JSON.stringify({
      //       ip,
      //       tempPass
      //     })
      //   );
    },
    clearCurrentExam: () => {
      setExamID("");
      setInstanceIP("");
      setTempPassword("");
      //   localStorage.removeItem("currentExam");
    }
  };

  //   useEffect(() => {
  //     const storedData = JSON.parse(localStorage.getItem("currentExam"));

  //     if (storedData) {
  //       const { instanceIP, tempPassword } = storedData;
  //       currentExamContext.setCurrentExam(instanceIP, tempPassword);
  //     }
  //   }, []);

  return (
    <CurrentExamContext.Provider value={currentExamContext}>
      {children}
    </CurrentExamContext.Provider>
  );
}
export default CurrentExamProvider;
