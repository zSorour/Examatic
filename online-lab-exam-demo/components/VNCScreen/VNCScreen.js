import React, { useRef } from "react";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";
import VNCScreenLayout from "./VNCScreenLayout/VNCScreenLayout";

const VNCScreen = () => {
  const vncScreenRef = useRef(null);

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
        url="ws://3.67.226.165:6080"
        scaleViewport
      ></VncScreen>
    </VNCScreenLayout>
  );
};

export default VNCScreen;
