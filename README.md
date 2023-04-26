# Table of Content

- [Table of Content](#table-of-content)
- [Project Brief](#project-brief)
- [Examatic Architecture Topology](#examatic-architecture-topology)
- [Project Demo](#project-demo)
- [Notes and Implementation Details](#notes-and-implementation-details)

# Project Brief

Examatic proposes a cloud-based architecture that automates and facilitates the delivery of hands-on software lab exams online. By using IaC server templating (Packer), configuration management (Ansible), and provisioning tools (Terraform), practical software lab exams can be delivered on the cloud.

Each examinee typically connects to an instance that is created automatically for them, on-demand, pre-configured with all the required software tools, dependencies, etc. In other words, each examinee is assigned a cloud instance running in the cloud to which they can connect and have a complete desktop experience right in their browsers.

To ensure that the proposed cloud architecture is highly available and scalable, the deployment of the backend server on a Kubernetes Cluster has proven to be very effective. By enabling autoscaling and self-healing capabilities of the Kubernetes Cluster, the backend server can scale out and in as needed according to the given load, while being highly available due to having multiple replicas of the pods and the Kubernetes Control Planes.

# Examatic Architecture Topology

The proposed architecture comprises 6 main components:

- Server Templating Component (Packer)
- Configuration Management Component (Ansible)
- Infrastructure Provisioning Component (Terraform)
- Front-End SPA
- Backend Server
- Database Server
- Container Orchestration using Kubernetes

Typically, Packer and Ansible will be integrated together to build a pre-configured server template containing all the required configurations for a certain type of exam. An examinee would use their web browser to access the frontend web application. With a click of a button, the frontend web application sends an HTTP request to the REST API backend server which in turn invokes Terraform to start provisioning the required cloud instance. Terraform uses the server template initially created using Packer and Ansible to create an EC2 instance on Amazon Web Services (AWS).

As the cloud instance is created via Terraform, the NodeJS backend server parses Terraform’s output representing the instance’s connection parameters and stores them in the database server. Consequently, it sends a response to the frontend web application containing the connection parameters so that the examinee can connect to the cloud instance’s full desktop experience using the VNC client integrated into the web application. Simultaneously, the web application shares the examinee’s screen to the invigilator’s device or a dedicated cloud instance.

![Architecture Topology](https://github.com/zSorour/Examatic/blob/master/images/Architecture%20Topology.png?raw=true 'Architecture Topology')

# Project Demo

Due to the costs of having the system deployed continuously, it has only been deployed for the duration of the graduation project demo and ICCSM 2022 conference presentation. However, **[a recorded video could be found here](https://1drv.ms/v/s!AsW7yJcOPv15iaZAkGMYipBcR7tbTw?e=mUMuBA 'Examatic Demo').**

<details>
<summary><b>User Flow (includes screenshots)</b></summary>
</br>
<ul>
  <details>
    <summary><b>Exam Instructor Flow</b></summary>

1. An instructor goes to the login page, enters username and password, and logs in:
   ![Instructor Login Page](https://github.com/zSorour/Examatic/blob/master/images/Instructor%20Login%20Page.png?raw=true 'Instructor Login Page')
2. The instructor clicks on the Exams link in the navigation bar and gets directed to the exams page. A list of exams assigned to the instructor should be displayed, if any, with a button to create an exam:
   ![Instructor Assigned Exams Page](https://github.com/zSorour/Examatic/blob/master/images/Instructor%20Assigned%20Exams%20Page.png?raw=true 'Instructor Assigned Exams Page')
3. As the instructor clicks on the “Create Exam” button, he/she gets navigated to the create exam page and a form is displayed to enter the exam information:
   ![Instructor Create Exam Form](https://github.com/zSorour/Examatic/blob/master/images/Instructor%20Create%20Exam%20Form.png?raw=true 'Instructor Create Exam Form')
4. After the instructor enters the exam information and clears out any input validation errors and clicks create, an animated loading screen is displayed informing the instructor about the expected time of exam creation, and an elapsed time counter.

   What happens behind the scenes is a request being sent to the REST API, which invokes Terraform CLI to create the necessary network infrastructure for this exam, and persists the exam's info in the database alongside the required network details:
   ![Creating Exam Infrastructure Popup](https://github.com/zSorour/Examatic/blob/master/images/Creating%20Exam%20Network%20Infra.png?raw=true 'Creating Exam Infrastructure Popup')

5. After the exam is created, the loading pop-up closes and the instructor is automatically redirected to the exams page. The exam that has just been created is now visible in the list of exams:
   ![Exam Created'](https://github.com/zSorour/Examatic/blob/master/images/Instructor%20Exam%20Network%20Infra%20Created.png?raw=true 'Exam Created')

  </details>
  
  <details>
    <summary><b>Examinee/Student Flow</b></summary>

1. A student goes to the login page, enters username and password, and logs in:
   ![Student login page](https://github.com/zSorour/Examatic/blob/master/images/Student%20Login%20Page.png?raw=true 'Student login page')
2. The student clicks on the Exams link in the navigation bar and gets directed to the exams page:
   ![Exams Page](https://github.com/zSorour/Examatic/blob/master/images/Exams%20Demo%20Screenshot.png?raw=true 'Exams Page')
3. Assuming the student/examinee has an exam within the next 10 minutes, as he/she clicks on the “Connect to Exam” button, a loading pop-up is displayed. Typically, the student gets connected to the exam in an average of 2 minutes and a half.
   The button click in fact sends a request to the NodeJS REST API which executes the business logic related to invoking Terraform CLI, parsing the output (instance IP, temp password), and sending them to the user:
   ![Clicking on Connect to Exam Button](https://github.com/zSorour/Examatic/blob/master/images/Creating%20Exam%20Instance%20Screenshot.png?raw=true 'Clicking on Connect to Exam Button')

4. As the exam cloud instance is created specifically for the student on-demand, he/she gets navigated to the current exam page. There, the student has access to the GUI of a cloud instance, right into their browser, using noVNC:
   ![Accessing Exam Instance in the Browser](https://github.com/zSorour/Examatic/blob/master/images/Logging%20into%20exam%20instance%20screenshot.png?raw=true 'Accessing Exam Instance in the Browser')
   ![In exam example](https://github.com/zSorour/Examatic/blob/master/images/In-Exam%20Demo%20Screenshot.png?raw=true 'In exam example screenshot')

  </details>
</ul>
</details>

# Notes and Implementation Details

- [Building a Customized VM Image (Server Template) Using Packer](https://github.com/zSorour/Examatic/tree/master/packer-windows-vs-template#building-a-vm-image-server-template-using-packer)

- [Provisioning Necessary Exams Cloud Infrastructure using Terraform](https://github.com/zSorour/Examatic/tree/master/system-demo/backend/terraform#provisioning-necessary-cloud-infrastructure-using-terraform)

- [Building a REST API integrated with Terraform CLI](https://github.com/zSorour/Examatic/tree/master/system-demo/backend#building-a-rest-api-using-nodejs-and-express)

- More sections coming soon.
