terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region                  = "eu-central-1"
  shared_credentials_file = "/home/zsorour/.aws/creds"
}


# let terraform adopt my default vpc on AWS so that I can use its data
# instead of hardcoding the values later on.
resource "aws_default_vpc" "default_vpc" {}


# data provider to get information about subnet ids of a certain VPC
data "aws_subnet_ids" "default_subnets" {
  vpc_id = aws_default_vpc.default_vpc.id
}


# data provider to get the latest ubuntu ami from AWS servers
data "aws_ami" "latest_ubuntu_ami" {
  most_recent = true
  owners      = ["099720109477"] #AMI created by Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}


# create security group
resource "aws_security_group" "http_server_sg" {
  name   = "http_server_sg"
  vpc_id = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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
    "name" = "http_server_sg"
  }
}


# Creating an EC2 Instance
resource "aws_instance" "http_server" {
  ami                    = data.aws_ami.latest_ubuntu_ami.id
  key_name               = "default-ec2"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.http_server_sg.id]
  subnet_id              = tolist(data.aws_subnet_ids.default_subnets.ids)[0]
}
