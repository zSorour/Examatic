import React from "react";

import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div>
      <div className={styles.DualRing}></div>
    </div>
  );
};

export default Spinner;
