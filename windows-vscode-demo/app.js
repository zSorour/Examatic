const express = require("express");
const { spawn } = require("child_process");

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

  const tfApply = spawn("terraform", [
    "-chdir=terraform",
    "apply",
    "-auto-approve",
    "-json"
  ]);

  let instance_ip;

  for await (const chunk of tfApply.stdout) {
    const stringifiedChunk = chunk.toString().trim();
    const jsonArray = stringifiedChunk.split(/\r?\n/);
    for (const jsonString of jsonArray) {
      const message = JSON.parse(jsonString);
      if (
        message.type === "outputs" &&
        message.outputs.windows_instance_public_ip.value
      ) {
        instance_ip = message.outputs.windows_instance_public_ip.value;
      }
    }
  }

  res.send({
    msg: "Instance created successfully.",
    public_ip: instance_ip
  });
});

const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
