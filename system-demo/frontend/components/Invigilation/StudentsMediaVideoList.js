import React from "react";
import StudentMediaVideo from "./StudentMediaVideo";

import styles from "./StudentsMediaVideoList.module.css";

export default function StudentsMediaVideoList({ studentStreams }) {
  const studentStreamsKeys = [...studentStreams.keys()];
  return (
    <ul className={styles.VideosList}>
      {studentStreamsKeys.map((studentUsername) => (
        <StudentMediaVideo
          key={studentUsername}
          studentStream={studentStreams.get(studentUsername)}
          studentUsername={studentUsername}
        />
      ))}
    </ul>
  );
}
