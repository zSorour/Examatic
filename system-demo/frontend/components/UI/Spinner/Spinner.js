import React from "react";

import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div>
      <div className={styles["sk-folding-cube"]}>
        <div
          className={[styles["sk-cube1"], styles["sk-cube"]].join(" ")}
        ></div>
        <div
          className={[styles["sk-cube2"], styles["sk-cube"]].join(" ")}
        ></div>
        <div
          className={[styles["sk-cube3"], styles["sk-cube"]].join(" ")}
        ></div>
        <div
          className={[styles["sk-cube4"], styles["sk-cube"]].join(" ")}
        ></div>
      </div>
    </div>
  );
};

export default Spinner;
