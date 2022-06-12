const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const os = require("os");

const { initiateDBConnection } = require("./db/db");
const authRouter = require("./routes/auth");
const examManagementRouter = require("./routes/examManagement");
const studentRouter = require("./routes/student");
const instanceTemplateRouter = require("./routes/instanceTemplate");
const instructorRouter = require("./routes/instructor");
const SocketIO = require("./SocketIO");

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
  initiateDBConnection();
});

SocketIO.initializeServer(server);

app.use("/auth", authRouter);

app.use("/exam-management", examManagementRouter);

app.use("/student", studentRouter);

app.use("/instance-templates", instanceTemplateRouter);

app.use("/instructor", instructorRouter);

app.use("/api/test-docker", (req, res) => {
  res.send(`Hello from Docker, Hostname: ${os.hostname()} PID: ${process.pid}`);
});

// define a catch-all error handler middleware
app.use("/", (err, req, res, next) => {
  res.status(err.code || 500);
  const errorMessage = err.message || "Server error.";
  const errorDetails = err.details || [
    "There is an issue on the server's side, please try again later."
  ];
  res.json({ error: errorMessage, errorDetails: errorDetails });
});
