import React, { useRef } from "react";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";
import VNCScreenLayout from "./VNCScreenLayout/VNCScreenLayout";

const VNCScreen = () => {
  const vncScreenRef = useRef(null);

  return (
    <VNCScreenLayout screenRef={vncScreenRef}>
      <VncScreen
        ref={vncScreenRef}
        onPaste={() => {
          const clipboard = navigator.clipboard;
          clipboard.readText().then((text) => {
            console.log(text);
          });
        }}
        url="ws://3.123.253.78:6080"
        scaleViewport
        retryDuration={5000}
      ></VncScreen>
    </VNCScreenLayout>
  );
};

export default VNCScreen;
