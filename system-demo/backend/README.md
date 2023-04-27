# Building a REST API using NodeJS and Express

**Note:** due to the project's limited time and the nature of being a proof of concept rather than an actual production server, some decisions have been taken to reduce the development time as much as possible and help iterate quickly.

For example, I would prefer if I had used Nest/Fastify instead of Express as the backend framework alongside TypeScript instead of plain JavaScript. This would have helped achieve better maintainability and code structure. Nevertheless, I've tried to follow some good development practices and design patterns as noted below.

## Following a Layered Architecture/Project Structure

To achieve the principle of “Separation of Concerns”, and to maintain modifiability and maintainability of the REST API backend server to some extent, the backend application adopts the 3-Layer architecture that consists of 3 essential layers: Controller, Service, and Data Access Layers. This separates the application/business logic from the ExpressJS framework controllers implemented to handle routes and requests. Moreover, this architecture eliminates the coupling between the service layer and the database server by having a data access layer in between. However, for the sake of simplicity, the authentication logic is coupled with the auth controller and is not encapsulated within a separate service file.

The flow of interaction between the layers and the implemented CommonJS modules starts by receiving an HTTP Request on one of the registered routes defined using Express Routers. The HTTP request is then delegated to the corresponding controller. The Controller’s responsibility is to parse the request body and pass it to the relevant Service modules to invoke the required business/application logic. The Service modules invoke the Data Access Layer, which is typically implemented in the form of Mongoose Model objects. As the Service module completes its functionality, it returns the required data to the Controller module, which is finally responsible for sending back a response to the user that had initiated the HTTP request.

All the validation logic is handled separately in specific modules in the [validators folder](https://github.com/zSorour/Examatic/tree/master/system-demo/backend/validators). Each validator module implements an “express-validator” middleware and exports it so that it can be easily incorporated as a middleware in the Express Router to ensure the validity of the data before the Controller proceeds to perform its functionalities.

## Implementing Terraform Service using Child Process Node Module

_Coming soon._

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
