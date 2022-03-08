import React from "react";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";

const VNCScreen = () => {
  return (
    <div>
      <VncScreen
        className={styles.VNCScreen}
        url="ws://3.71.43.138:6080"
        scaleViewport
      ></VncScreen>
    </div>
  );
};

export default VNCScreen;
