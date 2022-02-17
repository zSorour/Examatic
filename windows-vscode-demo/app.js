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

  let output;

  for await (const chunk of tfApply.stdout) {
    // parse the buffered chunk to JSON
    try {
      const parsedChunk = JSON.parse(chunk);
      // only concerned with the chunk of type outputs.
      // this contains Terraform output
      if (parsedChunk.type === "outputs") {
        output = parsedChunk.outputs;
      }
    } catch (error) {
      output = "error";
    }
  }
  res.json(output);
});

const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
