import React, { useState, useContext } from "react";

import styles from "./VNCScreenLayout.module.css";
import CurrentExamContext from "../../../store/current-exam-context/currentExamContext";

const VNCScreenLayout = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const currentExamContext = useContext(CurrentExamContext);

  const sendCtrlAltDelSequence = () => {
    const { sendCtrlAltDel, connected } = props.screenRef.current;
    if (connected) {
      sendCtrlAltDel();
    }
  };

  return (
    <div className={styles.VNCScreenWrapper}>
      <div className={styles.VNCScreenOptions}>
        <div className={styles.Actions}>
          <button onClick={sendCtrlAltDelSequence}>
            Send Ctrl+Alt+Del Command
          </button>
        </div>
        <div className={styles.PasswordContainer}>
          <button
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? "Hide" : "Show"} Temporary Password
          </button>
          <p>{showPassword ? currentExamContext.tempPassword : "********"}</p>
        </div>
      </div>

      {props.children}
    </div>
  );
};

export default VNCScreenLayout;
