const express = require("express");
const { spawn, spawnSync } = require("child_process");

const PORT = 3000;
const app = express();

app.use(express.json());

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

const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
