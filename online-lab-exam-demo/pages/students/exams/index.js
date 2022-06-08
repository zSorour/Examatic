import { useEffect, useState, useContext } from "react";
import ExamsList from "../../../components/ExamsList/ExamsList";
import { useHttpClient } from "../../../hooks/http-hook";
import { Modal } from "@mui/material";
import Spinner from "../../../components/UI/Spinner/Spinner";
import AuthContext from "../../../store/auth-context/authContext";
import modalStyles from "../../../styles/Modal.module.css";

export default function ExamsPage() {
  const [exams, setExams] = useState();
  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const authCTX = useContext(AuthContext);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/student/exams?username=${authCTX.username}`,
          "GET"
        );
        setExams(data.studentExams);
      } catch (err) {}
    };
    fetchExams();
  }, [sendRequest]);

  return (
    <div>
      {!isLoading && exams && <ExamsList exams={exams} />}

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
