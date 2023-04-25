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

Typically, Packer and Ansible will be integrated together tobuild a pre-configured server template containing all the required configurations for a certain type of exam. An examinee would use their web browser to access the frontend web application. With a click of a button, the frontend web application sends an HTTP request to the REST API backend server which in turn invokes Terraform to start provisioning the required cloud instance. Terraform uses the server template initially created using Packer and Ansible to create an EC2 instance on Amazon Web Services (AWS).

As the cloudinstance is created via Terraform, the NodeJS backend server parses Terraform’s output representing the instance’s connection parameters and stores them in the database server. Consequently, it sends a response to the frontend web application containing the connection parameters so that the examinee can connect to the cloud instance’s full desktop experience using the VNC client integrated into the web application. Simultaneously, the web application shares the examinee’s screen to the invigilator’s device or a dedicated cloud instance.

![Architecture Topology](https://github.com/zSorour/Examatic/blob/master/images/architecture-topology.png?raw=true 'Architecture Topology')

## Notes and Implementation Details

- [Building a Customized VM Image (Server Template) Using Packer](https://github.com/zSorour/Examatic/tree/master/packer-windows-vs-template#building-a-vm-image-server-template-using-packer)
- More sections coming soon.
