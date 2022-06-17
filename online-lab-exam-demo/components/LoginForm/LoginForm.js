import React, { useContext } from "react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { useHttpClient } from "../../hooks/http-hook";
import AuthContext from "../../store/auth-context/authContext";
import styles from "./LoginForm.module.css";
import modalStyles from "../../styles/Modal.module.css";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import { Avatar, Modal } from "@mui/material";
import Spinner from "../UI/Spinner/Spinner";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const router = useRouter();

  const authCTX = useContext(AuthContext);

  const onSubmit = async (formData) => {
    let responseData;
    try {
      responseData = await sendRequest(
        "http://localhost:5000/auth/login",
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json"
        }
      );
      const { userId, username, role, token } = responseData;
      authCTX.login(userId, username, role, token);
      if (role === "Student") {
        router.push("/students");
      } else if (authCTX.role === "Instructor") {
        router.push("/instructors");
      }
    } catch (err) {
      console.log("Error signing in.");
    }
  };

  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit(onSubmit)}>
      <Avatar
        className={styles.Avatar}
        sx={{ width: "80px", height: "80px", backgroundColor: "white" }}
      >
        <LockOpenOutlined
          sx={{ fill: "#292f6b", width: "50px", height: "50px" }}
        />
      </Avatar>

      <div className={styles.Input}>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className={styles.Error}>Username cannot be empty</p>
        )}
      </div>

      <div className={styles.Input}>
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className={styles.Error}>Password cannot be empty</p>
        )}
      </div>

      <div className={styles.Role}>
        <div className={styles.RadioInput}>
          <input
            type="radio"
            value="Student"
            id="role-student"
            defaultChecked
            {...register("role", { required: true })}
          />
          <label htmlFor="role-student">Student</label>
        </div>

        <div className={styles.RadioInput}>
          <input
            type="radio"
            value="Instructor"
            id="role-instructor"
            {...register("role", { required: true })}
          />
          <label htmlFor="role-instructor">Instructor</label>
        </div>
      </div>
      {errors.role && <p className={styles.Error}>Role cannot be empty</p>}

      <input className={styles.Button} type="submit" value="Login" />

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
    </form>
  );
};

export default LoginForm;
