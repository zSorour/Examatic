import React from "react";

import Link from "next/link";

import { useEffect, useState, useContext } from "react";
import ExamsList from "../../../components/ExamsList/ExamsList";
import { useHttpClient } from "../../../hooks/http-hook";
import { Modal } from "@mui/material";
import Spinner from "../../../components/UI/Spinner/Spinner";
import AuthContext from "../../../store/auth-context/authContext";
import modalStyles from "../../../styles/Modal.module.css";

import styles from "./InstructorExamsPage.module.css";

export default function InstructorExamsPage() {
  const [exams, setExams] = useState();
  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const authCTX = useContext(AuthContext);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/instructor/exams?username=${authCTX.username}`,
          "GET"
        );
        setExams(data.instructorExams);
      } catch (err) {}
    };
    fetchExams();
  }, [sendRequest]);

  return (
    <div className={styles.Container}>
      <div className={styles.CreateExamButtonContainer}>
        <div className={styles.CreateExamButton}>
          <Link href="/instructors/exams/create-exam" passHref>
            <a>Create Exam</a>
          </Link>
        </div>
      </div>

      <div className={styles.ExamsListContainer}>
        {!isLoading && exams && (
          <ExamsList exams={exams} previewType="InstructorPreview" />
        )}
      </div>

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
          <Spinner />
        </div>
      </Modal>
    </div>
  );
}
