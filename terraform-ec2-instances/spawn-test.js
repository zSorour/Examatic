const { spawn } = require("child_process");

// todo: error handling in spawn

const main = async () => {
  /*
  for automation usage, we execute the terraform apply command using
  -json and -auto-approve
  this outputs the result in a JSON machine readable format that we
  can easily parse later.
  */

  const child = spawn("terraform", ["apply", "-auto-approve", "-json"]);
  let output;
  // use async iterators to read the readable stream child.stdout
  for await (const chunk of child.stdout) {
    // parse the buffered chunk to JSON
    const parsedChunk = JSON.parse(chunk);
    // only concerned with the chunk of type outputs.
    // this contains Terraform output
    if (parsedChunk.type === "outputs") {
      output = parsedChunk;
    }
  }
  console.log(output);
};

main();
