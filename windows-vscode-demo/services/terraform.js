const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { spawn } = require("child_process");

const terraformWorkspaceExists = async (dir, workspaceName) => {
  let exists = false;
  const { stdout } = await exec(`terraform -chdir=${dir} workspace list`);
  if (stdout.includes(workspaceName)) {
    exists = true;
  }

  const promise = new Promise((resolve, reject) => {
    if (exists) {
      resolve(true);
    } else {
      reject(false);
    }
  });

  return promise;
};

const createTerraformWorkspace = async (dir, workspaceName) => {
  let success = true;
  try {
    await exec(`terraform -chdir=${dir} workspace new ${workspaceName}`);
  } catch (err) {
    success = false;
  }

  const promise = new Promise((resolve, reject) => {
    if (success) {
      resolve("Workspace created successfully");
    } else {
      reject("Could not create workspace");
    }
  });

  return promise;
};

const selectTerraformWorkspace = async (dir, workspaceName) => {
  let success = true;
  try {
    await exec(`terraform -chdir=${dir} workspace select ${workspaceName}`);
  } catch (err) {
    success = false;
  }

  const promise = new Promise((resolve, reject) => {
    if (success) {
      resolve("Workspace selected successfully");
    } else {
      reject("Could not select workspace");
    }
  });

  return promise;
};

const applyTerraform = async (dir) => {
  /*
    for automation, we execute the terraform apply command using
    -json and -auto-approve
    this outputs the result in a JSON machine readable format that we
    can easily parse later.
    */

  const tfApply = spawn("terraform", [
    `-chdir=${dir}`,
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
        // skip errors due to parsing JSON
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

  const promise = new Promise((resolve, reject) => {
    if (instance_ip && temp_password) {
      resolve({
        instance_ip,
        temp_password
      });
    } else {
      reject("Could not apply terraform configuration");
    }
  });

  return promise;
};

const createTerraformInfrastructure = async (dir, workspaceName) => {
  let terraformResult;
  let error;
  try {
    const workspaceExists = await terraformWorkspaceExists(dir, workspaceName);
    if (workspaceExists) {
      await selectTerraformWorkspace(dir, workspaceName);
    } else {
      await createTerraformWorkspace(dir, workspaceName);
    }
    terraformResult = await applyTerraform(dir);
  } catch (err) {
    error = err;
  }

  const promise = new Promise((resolve, reject) => {
    if (terraformResult) {
      resolve(terraformResult);
    } else {
      reject({
        message: "Could not create terraform infrastructure",
        details: error
      });
    }
  });

  return promise;
};

module.exports.terraformWorkspaceExists = terraformWorkspaceExists;
module.exports.selectTerraformWorkspace = selectTerraformWorkspace;
module.exports.createTerraformWorkspace = createTerraformWorkspace;
module.exports.applyTerraform = applyTerraform;
module.exports.createTerraformInfrastructure = createTerraformInfrastructure;
