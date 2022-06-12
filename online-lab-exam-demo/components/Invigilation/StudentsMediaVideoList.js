import React from "react";
import StudentMediaVideo from "./StudentMediaVideo";

export default function StudentsMediaVideoList({ studentStreams }) {
  const studentStreamsKeys = [...studentStreams.keys()];
  return (
    <ul>
      {studentStreamsKeys.map((studentUsername) => {
        <StudentMediaVideo
          key={studentUsername}
          studentStream={studentStreams.get(studentUsername)}
          studentUsername={studentUsername}
        />;
      })}
    </ul>
  );
}
