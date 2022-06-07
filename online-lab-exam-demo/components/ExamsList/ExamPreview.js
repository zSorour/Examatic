import React from "react";
import { Card, CardActions, CardContent } from "@mui/material";

import styles from "./ExamPreview.module.css";

const isExamWithin10Mins = (exam) => {
  const now = new Date();
  const examDate = new Date(exam.startDateTime);
  const diff = examDate.getTime() - now.getTime();
  const diffInMins = diff / 1000 / 60;
  console.log(diffInMins);
  return diffInMins <= 10;
};

const isExamEnded = (exam) => {
  const now = new Date();
  const examEndDate = new Date(exam.startDateTime);
  examEndDate.setMinutes(examEndDate.getMinutes() + exam.duration);
  console.log(examEndDate);
  return now > examEndDate;
};

export default function ExamPreview({ exam }) {
  const ISODate = exam.startDateTime;
  const formattedDate = new Date(ISODate).toLocaleString();

  let examCardAction;

  if (isExamEnded(exam)) {
    examCardAction = <p className={styles.ActionsMessage}>Exam ended.</p>;
  } else if (isExamWithin10Mins(exam)) {
    examCardAction = <button className={styles.Button}>Connect to Exam</button>;
  } else {
    examCardAction = (
      <p className={styles.ActionsMessage}>
        Connecting to the exam is allowed only 10 minutes before its start time.
      </p>
    );
  }

  return (
    <Card className={styles.Card} sx={{ borderRadius: 10 }}>
      <CardContent className={styles.CardContent}>
        <h1>{exam.courseName}</h1>
        <h2>{exam.name}</h2>
        <h2>Duration: {exam.duration} minutes</h2>
        <h3>Date: {formattedDate}</h3>
      </CardContent>
      <CardActions className={styles.CardActions}>{examCardAction}</CardActions>
    </Card>
  );
}
