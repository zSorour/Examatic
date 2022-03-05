import React from "react";

import { VncScreen } from "react-vnc";

import styles from "./VNCScreen.module.css";

const VNCScreen = () => {
  return (
    <div>
      <VncScreen
        className={styles.VNCScreen}
        url="ws://18.194.51.209:6080"
        scaleViewport
      ></VncScreen>
    </div>
  );
};

export default VNCScreen;
