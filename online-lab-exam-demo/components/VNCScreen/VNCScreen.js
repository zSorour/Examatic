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
        onPaste={() => {
          const clipboard = navigator.clipboard;
          clipboard.readText().then((text) => {
            console.log(text);
          });
        }}
        url={`ws://${currentExamCTX.instanceIP}:6080`}
        scaleViewport
      ></VncScreen>
    </VNCScreenLayout>
  );
};

export default VNCScreen;
