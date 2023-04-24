# Project Brief

Examatic proposes a cloud-based architecture that automates and facilitates the delivery of hands-on software lab exams online. By using IaC server templating (Packer), configuration management (Ansible), and provisioning tools (Terraform), practical software lab exams can be delivered on the cloud.

Each examinee typically connects to an instance that is created automatically for them, on-demand, pre-configured with all the required software tools, dependencies, etc. In otherwords, each examinee is assigned a cloud instance running in the cloud to which they can connect and have a complete desktop experience right in their browsers.

To ensure that the proposed cloud architecture is highly available and scalable, the deployment of the backend server on a Kubernetes Cluster has proven to be very effective. By enabling autoscaling and self-healing capabilities of the Kubernetes Cluster, the backend server can scale out and in as needed according to the given load, while being highly available due to having multiple replicas of the pods and the Kubernetes Control Planes.

# Project Demo

Due to the costs of having the system deployed continuously, it has only beed deployed for the duration of the graduation project demo and ICCSM 2022 conferece presentation. However, [a recorded video could be found here](https://1drv.ms/v/s!AsW7yJcOPv15iaZAkGMYipBcR7tbTw?e=mUMuBA 'Examatic Demo').

# Examatic Architecture Topology

The proposed architecture comprises 6 main components:

- Server Templating Component (Packer)
- Configuration Management Component (Ansible)
- Infrastructure Provisioning Component (Terraform)
- Front-End SPA
- Backend Server
- Database Server
- Container Orchestration using Kubernetes

The architecture aims at automating the process of provisioning cloud infrastructure by using IaC server templating and configuration management tools, Packer and Ansible, to build a pre-configured image that contains the required operating system, software programs, software dependencies, appropriate user configurations, etc.

Typically, an examinee uses their browser to access a front-end web application that communicates with a REST API backend server. With a click of a button, the web application initiates a request to the backend server, which in turn issues a request to Terraform’s API to start provisioning the required cloud instance.

Terraform uses the image created by Packer and Ansible to spin up an AWS EC2 instance that is pre-configured with all the required software and responds with the required connection parameters.

The backend server stores the connection parameters in the database server and responds to the web application with the appropriate connection parameters.

The examinee uses the web application to connect to the cloud instance’s full desktop experience using the VNC client integrated into the web application. Meanwhile, the web application starts sharing the examinee’s screen to the invigilator’s device to monitor examinees and limit cheating, plagiarism, and any suspicious behavior.

![Architecture Topology](https://github.com/zSorour/Examatic/blob/master/images/architecture-topology.png?raw=true 'Architecture Topology')

## Notes and Implementation Details

- [Building a Customized VM Image (Server Template) Using Packer](https://github.com/zSorour/Examatic/tree/master/packer-windows-vs-template#building-a-vm-image-server-template-using-packer)
- More sections coming soon.
