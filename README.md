# Project Brief

Examatic proposes a cloud-based architecture that automates and facilitates the delivery of hands-on software lab exams online. By using IaC server templating (Packer), configuration management (Ansible), and provisioning tools (Terraform), practical software lab exams can be delivered on the cloud.

Each examinee typically connects to an instance that is created automatically for them, on-demand, pre-configured with all the required software tools, dependencies, etc. In otherwords, each examinee is assigned a cloud instance running in the cloud to which they can connect and have a complete desktop experience right in their browsers.

To ensure that the proposed cloud architecture is highly available and scalable, the deployment of the backend server on a Kubernetes Cluster has proven to be very effective. By enabling autoscaling and self-healing capabilities of the Kubernetes Cluster, the backend server can scale out and in as needed according to the given load, while being highly available due to having multiple replicas of the pods and the Kubernetes Control Planes.

# Project Demo

Due to the costs of having the system deployed continuously, it has only beed deployed for the duration of the graduation project demo and ICCSM 2022 conferece presentation. However, [a recorded video could be found here](https://1drv.ms/v/s!AsW7yJcOPv15iaZAkGMYipBcR7tbTw?e=mUMuBA 'Examatic Demo').
