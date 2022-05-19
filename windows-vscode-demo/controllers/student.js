const { ObjectId } = require("mongoose").Types;
const { validationResult } = require("express-validator");

const mongoose = require("mongoose");
const { spawn, spawnSync } = require("child_process");

const HttpError = require("../models/HTTPError");
const Student = require("../models/Student");

module.exports.getStudentExams = async (req, res, next) => {
  const studentUsername = req.query.username;
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
    return next(error);
  }

  if (!student) {
    const error = new HttpError(
      "Invalid Student",
      ["No student with the given username exists."],
      404
    );
    return next(error);
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
    return next(error);
  }

  const studentExams = student.enrolledExams.map((exam) => {
    return { name: exam.name, duration: exam.duration };
  });

  res.send({
    studentExams: studentExams
  });
};

module.exports.getCurrentExam = async (req, res, next) => {
  const studentUsername = req.query.username;
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
    return next(error);
  }

  if (!student) {
    const error = new HttpError(
      "Invalid Student",
      ["No student with the given username exists."],
      404
    );
    return next(error);
  }

  if (!student.currentExam.examDetails) {
    const error = new HttpError(
      "No Current Exam",
      ["There is no current exam registered, please connect to an exam."],
      404
    );
    return next(error);
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
    return next(error);
  }

  res.send({
    examDetails: {
      examName: student.currentExam.examDetails.name,
      examDuration: student.currentExam.examDetails.duration
    },
    instanceDetails: student.currentExam.assignedInstance
  });
};

module.exports.connectToExam = async (req, res, next) => {
  /*
    for automation usage, we execute the terraform apply command using
    -json and -auto-approve
    this outputs the result in a JSON machine readable format that we
    can easily parse later.
    */

  const studentUsername = req.body.username;

  console.log(studentUsername);

  const tfNewWorkspace = spawn("terraform", [
    "-chdir=terraform/exam_instance",
    "workspace",
    "new",
    studentUsername
  ]);

  tfNewWorkspace.on("exit", (code, signal) => {
    if (code !== 0) {
      // Could not create workspace, it already exists
      spawnSync("terraform", [
        "-chdir=terraform/exam_instance",
        "workspace",
        "select",
        studentUsername
      ]);
    } else {
      spawnSync("terraform", ["-chdir=terraform/exam_instance", "init"]);
    }

    // todo: use async/await instead of spawnSync for non-blocking flow
  });

  const tfApply = spawn("terraform", [
    "-chdir=terraform/exam_instance",
    "apply",
    "-auto-approve",
    "-json"
  ]);

  let instance_ip, temp_password;

  for await (const chunk of tfApply.stdout) {
    const stringifiedChunk = chunk.toString().trim();
    const jsonArray = stringifiedChunk.split(/\r?\n/);
    for (const jsonString of jsonArray) {
      let message;
      try {
        message = JSON.parse(jsonString);
        console.log(message);
      } catch (error) {
        console.log(jsonString);
        continue;
      }

      if (
        message.type === "outputs" &&
        message.outputs.windows_instance_public_ip.value
      ) {
        instance_ip = message.outputs.windows_instance_public_ip.value;
        temp_password = message.outputs.windows_instance_student_password.value;
      }
    }
  }

  res.send({
    msg: "Instance created successfully.",
    public_ip: instance_ip,
    temp_password: temp_password
  });
};
