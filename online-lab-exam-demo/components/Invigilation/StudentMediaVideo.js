import React, { useRef } from "react";

import styles from "./StudentMediaVideo.module.css";

export default function StudentMediaVideo({ studentStream, studentUsername }) {
  const studentVideoRef = useRef(null);
  studentVideoRef.current.srcObject = studentStream;
  return (
    <li className={styles.VideoContainer}>
      <video playsInline autoPlay ref={studentVideoRef} />
      <p>{studentUsername}</p>
    </li>
  );
}
