import React from "react";

import styles from "./VNCScreenLayout.module.css";

const VNCScreenLayout = (props) => {
  const sendCtrlAltDelSequence = () => {
    const { sendCtrlAltDel, connected } = props.screenRef.current;
    if (connected) {
      sendCtrlAltDel();
    }
  };

  return (
    <div className={styles.VNCScreenWrapper}>
      <div className={styles.VNCScreenOptions}>
        <button onClick={sendCtrlAltDelSequence}>Ctrl Alt Del</button>
        <button>Win</button>
      </div>
      {props.children}
    </div>
  );
};

export default VNCScreenLayout;
