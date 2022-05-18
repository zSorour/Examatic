const express = require("express");
const { spawn, spawnSync } = require("child_process");
const dotenv = require("dotenv");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const { initiateDBConnection } = require("./db/db");
const authRouter = require("./routes/auth");
const examManagementRouter = require("./routes/examManagement");

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

/*
 Create a 'Peer Server' to act as a connection broker between peers.
 No p2p data goes through the server! The server is only a connection broker.
*/
const peerJSServer = ExpressPeerServer(server, {
  path: "/"
});

// attach peerJS broker to the route '/peerjs-broker'
app.use("/peerjs-broker", peerJSServer);

app.get("/create-instance", async (req, res, next) => {
  /*
  for automation usage, we execute the terraform apply command using
  -json and -auto-approve
  this outputs the result in a JSON machine readable format that we
  can easily parse later.
  */

  const studentID = 186081;

  const tfNewWorkspace = spawn("terraform", [
    "-chdir=terraform",
    "workspace",
    "new",
    studentID
  ]);

  tfNewWorkspace.on("exit", (code, signal) => {
    if (code !== 0) {
      // Could not create workspace, it already exists
      spawnSync("terraform", [
        "-chdir=terraform",
        "workspace",
        "select",
        studentID
      ]);
    } else {
      spawnSync("terraform", ["-chdir=terraform", "init"]);
    }

    // todo: use async/await instead of spawnSync for non-blocking flow
  });

  const tfApply = spawn("terraform", [
    "-chdir=terraform",
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
});

app.use("/auth", authRouter);

app.use("/exam-management", examManagementRouter);

// define a catch-all error handler middleware
app.use("/", (err, req, res, next) => {
  res.status(err.code || 500);
  const errorMessage = err.message || "Server error.";
  const errorDetails = err.details || [
    "There is an issue on the server's side, please try again later."
  ];
  res.json({ error: errorMessage, errorDetails: errorDetails });
});
