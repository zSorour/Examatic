import React, { useRef } from "react";

import styles from "./StudentMediaVideo.module.css";

export default function StudentMediaVideo({ studentStream }) {
  const studentVideoRef = useRef(null);
  studentVideoRef.current.srcObject = studentStream;
  return (
    <div>
      <video playsInline autoPlay ref={studentVideoRef} />
    </div>
  );
}
