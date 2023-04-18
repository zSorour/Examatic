import React, { useRef, useContext } from "react";
import CurrentExamContext from "../../store/current-exam-context/currentExamContext";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";
import VNCScreenLayout from "./VNCScreenLayout/VNCScreenLayout";

const VNCScreen = () => {
  const vncScreenRef = useRef(null);

  const currentExamCTX = useContext(CurrentExamContext);

  return (
    <VNCScreenLayout screenRef={vncScreenRef}>
      <VncScreen
        className={styles.VNCScreen}
        ref={vncScreenRef}
        url={`ws://${currentExamCTX.instanceIP}:6080`}
        scaleViewport
        retryDuration="1000"
        rfbOptions={{
          credentials: {
            password: "testing@Password1"
          }
        }}
      ></VncScreen>
    </VNCScreenLayout>
  );
};

export default VNCScreen;
