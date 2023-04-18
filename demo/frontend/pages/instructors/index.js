import React, { useContext } from "react";
import AuthContext from "../../store/auth-context/authContext";
import Link from "next/link";

import styles from "./InstructorsDashboard.module.css";

export default function InstructorsDashboard() {
  const authCTX = useContext(AuthContext);

  return (
    <div className={styles.Container}>
      <div className={styles.WelcomeMessage}>
        <h1>
          Welcome back{" "}
          <span className={styles.Username}>{authCTX.username}</span>!
        </h1>
      </div>
      <div className={styles.GoToExamsPage}>
        <p>Check assigned exams...</p>
        <div className={styles.ButtonContainer}>
          <Link href="/instructors/exams" passHref>
            <a className={styles.AnimatedText}>Go to Exams Page</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
