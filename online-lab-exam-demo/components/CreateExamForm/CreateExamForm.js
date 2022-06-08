import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useStopwatch } from "react-timer-hook";
import { useHttpClient } from "../../hooks/http-hook";
import AuthContext from "../../store/auth-context/authContext";
import Spinner from "../UI/Spinner/Spinner";
import { Modal } from "@mui/material";

import styles from "./CreateExamForm.module.css";
import modalStyles from "../../styles/Modal.module.css";

const parseDateTime = (date, time) => {
  const [hh, mm] = time.split(":");
  const dateTime = new Date(date + "T00:00");
  dateTime.setHours(hh);
  dateTime.setMinutes(mm);
  return dateTime.toISOString();
};

const formatNumberTwoDigits = (number) => {
  return number.toLocaleString("en-US", {
    minimumIntegerDigits: 2
  });
};

export default function CreateExamForm() {
  const [instanceTemplates, setInstanceTemplates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instanceTemplateInfo, setInstanceTemplateInfo] = useState("");

  const [isCreatingInstance, setIsCreatingInstance] = useState(false);

  const router = useRouter();

  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const authCTX = useContext(AuthContext);

  const getInstanceTemplates = () => {
    return sendRequest(`http://localhost:5000/instance-templates`, "GET");
  };

  const getCourses = async () => {
    return sendRequest(
      `http://localhost:5000/instructor/courses?username=${authCTX.username}`,
      "GET"
    );
  };

  useEffect(() => {
    const fetchInstanceTemplatesAndCourses = async () => {
      try {
        const [instanceTemplatesRes, coursesRes] = await Promise.all([
          getInstanceTemplates(),
          getCourses()
        ]);
        setInstanceTemplates(instanceTemplatesRes.instanceTemplates);
        setCourses(coursesRes.assignedCourses);
      } catch (err) {}
    };
    fetchInstanceTemplatesAndCourses();
  }, []);

  const onInstanceTemplateChange = (e) => {
    const instanceTemplate = instanceTemplates.find(
      (instanceTemplate) => instanceTemplate.name === e.target.value
    );
    setInstanceTemplateInfo(instanceTemplate.description);
  };

  const onSubmit = async (formData) => {
    const course = JSON.parse(formData.courseNameCode);
    const courseCode = course.code;
    const courseName = course.name;
    const { name, duration, startDate, startTime, instanceTemplateName } =
      formData;
    const startDateTime = parseDateTime(startDate, startTime);
    console.log(startDateTime);

    try {
      setIsCreatingInstance(true);
      start();
      const data = await sendRequest(
        `http://localhost:5000/exam-management/create-exam`,
        "POST",
        JSON.stringify({
          name,
          duration,
          startDateTime,
          courseCode,
          courseName,
          instanceTemplateName,
          instructorID: authCTX.id
        }),
        { "Content-Type": "application/json" }
      );
      setIsCreatingInstance(false);
      reset();
      if (!data.error) {
        router.push("/instructors/exams");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {!isLoading && (
        <form
          className={styles.CreateExamForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.Input}>
            <label>Course:</label>
            <select
              {...register("courseNameCode", {
                required: true,
                validate: (value) => value !== "default"
              })}
            >
              <option hidden value="default">
                Select a course
              </option>
              {courses.map((course) => (
                <option
                  key={course._id}
                  value={JSON.stringify({
                    code: course.code,
                    name: course.name
                  })}
                >{`${course.code} - ${course.name}`}</option>
              ))}
            </select>
            {errors.courseNameCode && (
              <p className={styles.Error}>Course name must be selected</p>
            )}
          </div>
          <div className={styles.Input}>
            <label>Exam Name:</label>
            <input type="text" {...register("name", { required: true })} />
            {errors.name && (
              <p className={styles.Error}>Exam name cannot be empty</p>
            )}
          </div>
          <div className={styles.Input}>
            <label>Exam duration (minutes):</label>
            <input
              type="number"
              min="15"
              {...register("duration", { required: true, min: 15 })}
            />
            {errors.duration && (
              <p className={styles.Error}>
                Duration must not be less than 15 minutes
              </p>
            )}
          </div>
          <div className={styles.Input}>
            <label>Exam start date:</label>
            <input
              className={styles.DateTime}
              type="date"
              {...register("startDate", { required: true })}
            />
            {errors.startDate && (
              <p className={styles.Error}>Start date must not be empty</p>
            )}
          </div>
          <div className={styles.Input}>
            <label>Exam start time:</label>
            <input
              className={styles.DateTime}
              type="time"
              {...register("startTime", { required: true })}
            />
            {errors.startTime && (
              <p className={styles.Error}>Start time must not be empty</p>
            )}
          </div>
          <div className={styles.Input}>
            <label>Instance Template:</label>
            <select
              {...register("instanceTemplateName", {
                required: true,
                validate: (value) => value !== "default",
                onChange: onInstanceTemplateChange
              })}
            >
              <option hidden value="default">
                Select an instance template
              </option>
              {instanceTemplates.map((instanceTemp) => (
                <option key={instanceTemp._id} value={instanceTemp.name}>
                  {instanceTemp.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Instance template description..."
              readOnly
              value={instanceTemplateInfo}
            />
            {errors.instanceTemplateName && (
              <p className={styles.Error}>
                Instance template must not be empty
              </p>
            )}
          </div>
          <input className={styles.Button} type="submit" value="Create" />
        </form>
      )}

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
          {isCreatingInstance && (
            <p className={modalStyles.Message}>
              Creating the exam network infrastructure for the first time takes
              around 40 seconds.
            </p>
          )}
          <Spinner />
          {isCreatingInstance && (
            <React.Fragment>
              <p className={modalStyles.Message}>Elapsed Time</p>
              <p className={modalStyles.Message}>
                {`${formatNumberTwoDigits(minutes)}:${formatNumberTwoDigits(
                  seconds
                )}`}
              </p>
            </React.Fragment>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
}
