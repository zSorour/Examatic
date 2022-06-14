import React from "react";
import StudentExamPreview from "./StudentExamPreview";

import styles from "./ExamsList.module.css";
import InstructorExamPreview from "./InstructorExamPreview";

export default function ExamsList({ exams, previewType }) {
  const sortedExams = exams.sort((a, b) => {
    return a.startDateTime > b.startDateTime ? -1 : 1;
  });

  const examPreviews = {
    StudentPreview: sortedExams.map((exam) => {
      return <StudentExamPreview key={exam.id} exam={exam} />;
    }),
    InstructorPreview: sortedExams.map((exam) => {
      return <InstructorExamPreview key={exam.id} exam={exam} />;
    })
  };

  return <div className={styles.ExamsList}>{examPreviews[previewType]}</div>;
}
