import React from "react";
import CreateExamForm from "../../../components/CreateExamForm/CreateExamForm";

import styles from "./CreateExamPage.module.css";

export default function CreateExamPage() {
  return (
    <React.Fragment>
      <h1 className={styles.Heading}>Create Exam Form</h1>
      <CreateExamForm />
    </React.Fragment>
  );
}
