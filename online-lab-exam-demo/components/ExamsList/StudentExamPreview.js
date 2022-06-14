import React, { useContext } from "react";
import { Card, CardActions, CardContent } from "@mui/material";
import AuthContext from "../../store/auth-context/authContext";
import CurrentExamContext from "../../store/current-exam-context/currentExamContext";
import { useHttpClient } from "../../hooks/http-hook";
import Spinner from "../UI/Spinner/Spinner";
import { Modal } from "@mui/material";
import { useStopwatch } from "react-timer-hook";
import { useRouter } from "next/router";

import styles from "./StudentExamPreview.module.css";
import modalStyles from "../../styles/Modal.module.css";

const isExamWithin10Mins = (exam) => {
  const now = new Date();
  const examDate = new Date(exam.startDateTime);
  const diff = examDate.getTime() - now.getTime();
  const diffInMins = diff / 1000 / 60;
  console.log(diffInMins);
  return diffInMins <= 100000000000;
};

const isExamEnded = (exam) => {
  const now = new Date();
  const examEndDate = new Date(exam.startDateTime);
  examEndDate.setMinutes(examEndDate.getMinutes() + exam.duration);
  console.log(examEndDate);
  return now > examEndDate;
};

const formatNumberTwoDigits = (number) => {
  return number.toLocaleString("en-US", {
    minimumIntegerDigits: 2
  });
};

export default function StudentExamPreview({ exam }) {
  console.log(exam);

  const authCTX = useContext(AuthContext);
  const currentExamCTX = useContext(CurrentExamContext);
  const router = useRouter();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });

  const connectToExam = async () => {
    try {
      start();
      const data = await sendRequest(
        "http://localhost:5000/student/connect-to-exam",
        "PATCH",
        JSON.stringify({
          username: authCTX.username,
          examID: exam.id
        }),
        {
          "Content-Type": "application/json"
        }
      );
      reset();
      const { publicIP, tempPassword } = data;
      currentExamCTX.setCurrentExam(exam.id, publicIP, tempPassword);
      if (!data.error) {
        router.push("/students/exams/current-exam");
      }
    } catch (err) {}
  };

  const ISODate = exam.startDateTime;
  const formattedDate = new Date(ISODate).toLocaleString();

  let examCardAction;

  if (isExamEnded(exam)) {
    examCardAction = <p className={styles.ActionsMessage}>Exam ended.</p>;
  } else if (isExamWithin10Mins(exam) && !exam.invigilationInstanceSocketID) {
    examCardAction = (
      <button className={styles.Button} onClick={() => connectToExam()}>
        Connect to Exam
      </button>
    );
  } else {
    examCardAction = (
      <p className={styles.ActionsMessage}>
        Connecting to the exam is allowed only 10 minutes before its start time,
        and an Instructor must have started invigilation.
      </p>
    );
  }

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
          {examCardAction}
        </CardActions>
      </Card>

      <Modal
        open={!!errorTitle}
        className={modalStyles.Modal}
        onClose={clearError}
      >
        <div className={modalStyles.ModalContent}>
          <h1 className={modalStyles.Title}>{errorTitle}</h1>
          <p className={modalStyles.Message}>{errorDetails[0]}</p>
          <div className={modalStyles.Actions}>
            <button onClick={clearError}>Ok</button>
          </div>
        </div>
      </Modal>

      <Modal open={isLoading} className={modalStyles.Modal}>
        <div className={modalStyles.ModalContent}>
          <p className={modalStyles.Message}>
            Creating the exam instance for the first time takes about 2 and a
            half minutes.
          </p>
          <Spinner />
          <p className={modalStyles.Message}>Elapsed Time</p>
          <p className={modalStyles.Message}>
            {`${formatNumberTwoDigits(minutes)}:${formatNumberTwoDigits(
              seconds
            )}`}
          </p>
        </div>
      </Modal>
    </React.Fragment>
  );
}
