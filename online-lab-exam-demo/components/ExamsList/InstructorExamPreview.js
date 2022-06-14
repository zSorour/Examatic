import React from "react";
import { Card, CardActions, CardContent } from "@mui/material";
import Link from "next/link";

import styles from "./InstructorExamPreview.module.css";

export default function InstructorExamPreview({ exam }) {
  const ISODate = exam.startDateTime;
  const formattedDate = new Date(ISODate).toLocaleString();

  return (
    <React.Fragment>
      <Card className={styles.Card} sx={{ borderRadius: 10 }}>
        <CardContent className={styles.CardContent}>
          <h1>{exam.courseName}</h1>
          <h2>{exam.name}</h2>
          <h2>Duration: {exam.duration} minutes</h2>
          <h3>Date: {formattedDate}</h3>
        </CardContent>
        <CardActions className={styles.CardActions}>
          <div className={styles.Button}>
            <Link
              href={{
                pathname: "/instructors/exams/invigilation",
                query: { examID: exam.id }
              }}
              passHref
              as="/instructors/exams/invigilation"
            >
              <a>Go to Invigilation Page</a>
            </Link>
          </div>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
