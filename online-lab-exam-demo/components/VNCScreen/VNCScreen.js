import React from "react";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";

const VNCScreen = () => {
  return (
    <div>
      <VncScreen
        className={styles.VNCScreen}
        onPaste={() => {
          const clipboard = navigator.clipboard;
          clipboard.readText().then((text) => {
            console.log(text);
          });
        }}
        url="ws://3.125.50.192:6080"
        scaleViewport
      ></VncScreen>
    </div>
  );
};

export default VNCScreen;
