import React, { useRef, useEffect } from "react";

import styles from "./StudentMediaVideo.module.css";

export default function StudentMediaVideo({ studentStream, studentUsername }) {
  const studentVideoRef = useRef();
  useEffect(() => {
    studentVideoRef.current.srcObject = studentStream;
  }, []);
  return (
    <li className={styles.VideoContainer}>
      <div className={styles.VideoOverlay}>
        <p>{studentUsername}</p>
      </div>
      <video autoPlay ref={studentVideoRef} />
    </li>
  );
}
