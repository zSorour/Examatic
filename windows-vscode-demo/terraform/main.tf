terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region                   = "eu-central-1"
  shared_credentials_files = ["/home/zsorour/.aws/creds"]
}


# let terraform adopt my default vpc on AWS so that I can use its data
# instead of hardcoding the values later on.
resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "Default VPC"
  }
}


# create security group
resource "aws_security_group" "windows_instance_sg" {
  name   = "windows_instance_sg"
  vpc_id = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5986
    to_port     = 5986
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5901
    to_port     = 5901
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5900
    to_port     = 5900
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6080
    to_port     = 6080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    "name" = "windows_instance_sg"
  }
}


# Creating a random password
resource "random_string" "instance_password" {
  length  = 12
  special = false
}


# Creating an EC2 Instance
resource "aws_instance" "windows_instance" {
  # ami = data.aws_ami.latest_windows_ami.id
  ami                    = "ami-0d15a83b87b8a03a2"
  key_name               = "default-ec2"
  instance_type          = "t3.xlarge"
  vpc_security_group_ids = [aws_security_group.windows_instance_sg.id]
  subnet_id              = tolist(data.aws_subnets.default_subnets.ids)[0]

  user_data = templatefile("set_password.txt", {
    instance_password = random_string.instance_password.result
  })

  ebs_block_device {
    volume_size = 100
    device_name = "/dev/sda1"
  }

}
