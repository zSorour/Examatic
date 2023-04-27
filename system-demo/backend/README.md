# Building a REST API using NodeJS and Express

**Note:** due to the project's limited time and the nature of being a proof of concept rather than an actual production server, some decisions have been taken to reduce the development time as much as possible and help iterate quickly.

For example, I would prefer if I had used Nest/Fastify instead of Express as the backend framework alongside TypeScript instead of plain JavaScript. This would have helped achieve better maintainability and code structure. Nevertheless, I've tried to follow some good development practices and design patterns as noted below.

## Following a Layered Architecture/Project Structure

To achieve the principle of “Separation of Concerns”, and to maintain modifiability and maintainability of the REST API backend server to some extent, the backend application adopts the 3-Layer architecture that consists of 3 essential layers: Controller, Service, and Data Access Layers. This separates the application/business logic from the ExpressJS framework controllers implemented to handle routes and requests. Moreover, this architecture eliminates the coupling between the service layer and the database server by having a data access layer in between. However, for the sake of simplicity, the authentication logic is coupled with the auth controller and is not encapsulated within a separate service file.

The flow of interaction between the layers and the implemented CommonJS modules starts by receiving an HTTP Request on one of the registered routes defined using Express Routers. The HTTP request is then delegated to the corresponding controller. The Controller’s responsibility is to parse the request body and pass it to the relevant Service modules to invoke the required business/application logic. The Service modules invoke the Data Access Layer, which is typically implemented in the form of Mongoose Model objects. As the Service module completes its functionality, it returns the required data to the Controller module, which is finally responsible for sending back a response to the user that had initiated the HTTP request.

All the validation logic is handled separately in specific modules in the [validators folder](https://github.com/zSorour/Examatic/tree/master/system-demo/backend/validators). Each validator module implements an “express-validator” middleware and exports it so that it can be easily incorporated as a middleware in the Express Router to ensure the validity of the data before the Controller proceeds to perform its functionalities.

## Implementing Terraform Service using Child Process Node Module

The [terraform.js service module](https://github.com/zSorour/Examatic/blob/master/system-demo/backend/services/terraform.js) defines a bunch of useful functions that invoke Terraform CLI from NodeJS using the [child process node module](https://nodejs.org/api/child_process.html).

Promisify function in the util node module is also used to provide a Promise-based API of the child process exec function as follows:

```js
const util = require('util');
const exec = util.promisify(require('child_process').exec);
```

This promisified exec function is used in `terraformWorkspaceExists`, `createTerraformWorkspace`, `selectTerraformWorkspace` functions. All these functions take the same input parameters:

1. dir: the working directory that contains the terraform HCL files
2. workspaceName: the name of the workspace we wish to perform the operation on.

Then, the function invokes the promisified exec function according to the desired functionality. For instance, to create a Terraform Workspace, one must execute the command:

```sh
terraform workspace new {workspace name}
```

Therefore, the `createTerraformWorkspace` function utilizes the promisified exec method to execute the same command using the desired workspace name coming from the input parameter, besides adding the `-chdir={dir}` argument to specify the target directory. This is done as follows:

```js
const createTerraformWorkspace = async (dir, workspaceName) => {
  let success = true;
  try {
    await exec(`terraform -chdir=${dir} workspace new ${workspaceName}`);
  } catch (err) {
    success = false;
  }

  const promise = new Promise((resolve, reject) => {
    if (success) {
      resolve('Workspace created successfully');
    } else {
      reject('Could not create workspace');
    }
  });

  return promise;
};
```

### Parsing Terraform Output Using Async Iterator Pattern with Streams

In the `applyTerraform` function inside terraform.js service module, the asynchronous [spawn](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) function of the NodeJS child process module has been used to spawn a terraform CLI process to execute the Terraform Apply command as follows:

```js
/*
    for automation, we execute the terraform apply command using
    -json and -auto-approve
    this outputs the result in a JSON machine readable format that we
    can easily parse later.
*/

const tfApply = spawn('terraform', [
  `-chdir=${dir}`,
  'apply',
  '-auto-approve',
  '-json',
  ...tfInputVariables
]);
```

According to the NodeJs docs, the spawn function returns a child process object, which includes a `stdout` property that represents a Readable Stream, which is a stream of data printed by the child process invoked, which is Terraform in this case.

Therefore, the output values of Terraform can be retrieved by reading the `stdout` stream and parsing it to get the actual output values. Since Readable Streams are compatible with Async Iterators in NodeJS, Async Iterators can be easily used to read the stream of data as it is being outputted by Terraform, in a non-blocking fashion.

The following illustrated code snippet shows Async Iterators in action:
![Using Async Iterator Pattern](https://github.com/zSorour/Examatic/blob/master/images/Usage%20of%20Async%20Iterator%20Pattern.png?raw=true 'Using Async Iterator Pattern')

You can find more information about the Async Iterator Pattern [here](https://www.nodejsdesignpatterns.com/blog/javascript-async-iterators/).

## Promises and Parallel Execution

The introduction of Promises and Async-Await has solved the issues of making asynchronous code highly unreadable, which was a major issue in the history of JavaScript and NodeJS referred to as “callback-hell”. Async-Await allows developers to write much more readable code that makes a certain asynchronous function pause until a certain Promise is resolved. Moreover, it makes error handling much easier using try… catch blocks as the errors of both asynchronous and synchronous functions are caught in the catch block. This unifies the error handling experience and improves the maintainability of asynchronous code.

Combining Promises with Async-Await provides a seamless implementation of concurrency and synchronization whenever needed. For instance, the **creation of an exam** using the exam management controller should invoke 3 different Service module asynchronous functions to make sure that:

1. The instructor making the request is enrolled in the course.
2. The specified instance template is correct.
3. That the given exam name is unique in the database.

These functions are implemented in the Service layer and return a Promise, each. Since there is no dependency between the 3 functions, performance can be vastly improved if they are executed in parallel. At the same time, the exam creation request handler in the controller must synchronize and wait until all 3 parallel executions are completed.

This has been easily achieved by awaiting the “Promise.all()” result. The “Promise.all()” typically takes as an argument an array of asynchronous function calls, and returns a Promise that gets resolved when all asynchronous functions promises are resolved. However, once a single asynchronous function promise is rejected, “Promise.all()” automatically rejects all other async functions and returns a rejected promise.

Example: Code snippet from [exam management controller](https://github.com/zSorour/Examatic/blob/master/system-demo/backend/controllers/examManagement.js):

```js
// ...some code to parse request body...

// Call promises in parallel. If anyone fails/rejects, all promises are rejected automatically.
let promisesResults;
try {
  promisesResults = await Promise.all([
    instructorService.isInstructorEnrolledToCourse(
      instructorID,
      courseName,
      courseCode
    ),
    instanceTemplateSerivce.doesInstanceTemplateExist(instanceTemplateName),
    examService.isExamUnique(name)
  ]);
} catch (error) {
  return next(error);
}

// Use array destructuring to get the results of first two promises.
const [instructor, instanceTemplate] = promisesResults;

// ...some code to create exam VPC by invoking Terraform service and saving the exam details in the db...
```

# Containerizing the Backend Server with Docker

A Docker Image is created based on the official NodeJS Alpine Linux Docker image, therefore, there is no need to write the configuration for installing NodeJS in the Dockerfile. However, the Dockerfile must be configured to have Terraform installed in the resulting Docker image. Moreover, the Dockerfile has been configured to start the backend server using [PM2](https://pm2.keymetrics.io/).

```dockerfile
FROM node:18.2-alpine

# install necessary software tools
RUN apk add --no-cache \
  zip \
  git \
  bash

# specify environment variables for Terraform Version and NodeJS production environment
ENV TERRAFORM_VERSION 1.2.0
ENV NODE_ENV production

# install Terraform
RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform.zip -d /usr/local/bin && \
  rm -f terraform.zip

# specify the working directory of the nodejs backend server
WORKDIR /app

# copy all files to the working directory.
# note: a .dockerignore file is used to ignore files that should not be copied such as node_modules
COPY ./ ./

# allow execution permissions on the entrypoint shell file, and install required node_modules
RUN chmod +x ./docker-entrypoint.sh && npm install && npm install pm2 --save -g

EXPOSE 5000

# invoke the entry point shell file on container start
ENTRYPOINT ["./docker-entrypoint.sh"]
```

By containerizing our our REST API, we make sure that the Terraform CLI is installed correctly and that we can seamlessly execute the commands via the terraform.js service module whenever we deploy our REST API.
