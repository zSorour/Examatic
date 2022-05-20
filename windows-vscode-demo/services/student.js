const { ObjectId } = require("mongoose").Types;

const Student = require("../models/Student");
const HttpError = require("../models/HTTPError");

const getStudentExams = async (studentUsername) => {
  const promise = new Promise(async (resolve, reject) => {
    let student;
    try {
      student = await Student.findOne({ username: studentUsername });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get the current exam."],
        500
      );
      return reject(error);
    }

    if (!student) {
      const error = new HttpError(
        "Invalid Student",
        ["No student with the given username exists."],
        404
      );
      return reject(error);
    }

    try {
      await student.populate("enrolledExams");
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get the student's exams"],
        500
      );
      return reject(error);
    }

    resolve(student.enrolledExams);
  });

  return promise;
};

const getCurrentExam = async (studentUsername) => {
  const promise = new Promise(async (resolve, reject) => {
    let student;
    try {
      student = await Student.findOne({ username: studentUsername });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get the current exam."],
        500
      );
      return reject(error);
    }

    if (!student) {
      const error = new HttpError(
        "Invalid Student",
        ["No student with the given username exists."],
        404
      );
      return reject(error);
    }

    if (!student.currentExam.examDetails) {
      const error = new HttpError(
        "No Current Exam",
        ["There is no current exam registered, please connect to an exam."],
        404
      );
      return reject(error);
    }

    try {
      await student.populate("currentExam.examDetails");
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get the current exam."],
        500
      );
      return reject(error);
    }

    resolve(student.currentExam);
  });

  return promise;
};

const isStudentEnrolledIntoExam = async (studentUsername, examID) => {
  const promise = new Promise(async (resolve, reject) => {
    let student;
    try {
      student = await Student.findOne({
        username: studentUsername,
        enrolledExams: new ObjectId(examID)
      });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't get the current exam."],
        500
      );
      return reject(error);
    }

    if (!student) {
      const error = new HttpError(
        "Invalid Student/Exam",
        ["No student with the given username is enrolled to the given exam."],
        404
      );
      return reject(error);
    }

    resolve(student);
  });

  return promise;
};

const setCurrentExam = async (
  studentUsername,
  examID,
  instanceIP,
  instancePassword
) => {
  const promise = new Promise(async (resolve, reject) => {
    let student;
    try {
      student = await isStudentEnrolledIntoExam(studentUsername, examID);
    } catch (err) {
      return reject(err);
    }
    student.currentExam.examDetails = new ObjectId(examID);
    student.currentExam.assignedInstance.instanceIP = instanceIP;
    student.currentExam.assignedInstance.instancePassword = instancePassword;
    try {
      await student.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Server Error",
        ["Couldn't set the current exam."],
        500
      );
      return reject(error);
    }

    resolve(student);
  });
  return promise;
};

module.exports.getStudentExams = getStudentExams;
module.exports.isStudentEnrolledIntoExam = isStudentEnrolledIntoExam;
module.exports.getCurrentExam = getCurrentExam;
module.exports.setCurrentExam = setCurrentExam;
