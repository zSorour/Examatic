import React from "react";
import ExamPreview from "./ExamPreview";

import styles from "./ExamsList.module.css";

export default function ExamsList({ exams }) {
  const sortedExams = exams.sort((a, b) => {
    return a.startDateTime > b.startDateTime ? -1 : 1;
  });

  return (
    <div className={styles.ExamsList}>
      {sortedExams.map((exam) => {
        return <ExamPreview key={exam.id} exam={exam} />;
      })}
    </div>
  );
}
