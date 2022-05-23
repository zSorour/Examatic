terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket                  = "186081-gp-tf-backend-state"
    workspace_key_prefix    = "exam-vpcs"
    key                     = "backend-state"
    region                  = "eu-central-1"
    dynamodb_table          = "186081-gp-tf-backend-state_locks"
    encrypt                 = true
    shared_credentials_file = "/home/zsorour/.aws/creds"
  }

}

provider "aws" {
  region                   = "eu-central-1"
  shared_credentials_files = ["/home/zsorour/.aws/creds"]
}


# create a vpc
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = "true" #internal domain name
  enable_dns_hostnames = "true" #internal host name
  instance_tenancy     = "default"

  tags = {
    "name" = terraform.workspace
  }
}

# create a subnet
resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/16"
  map_public_ip_on_launch = true #public subnet
  tags = {
    "name" = "${terraform.workspace}-public-subnet"
  }
}


# create an internet gateway (igw)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "name" = "${terraform.workspace}-igw"
  }
}

# create a custom routing table
resource "aws_route_table" "custom-route-table" {
  vpc_id = aws_vpc.vpc.id

  route {
    # associated subnet can communicate with any ip on the internet
    cidr_block = "0.0.0.0/0"
    # let the custom route table use the created igw to reach internet
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    "name" = "${terraform.workspace}-crt"
  }
}

# associate the custom route table with the public subnet
resource "aws_route_table_association" "crta-public-subnet-1" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.custom-route-table.id
}

# create and attach a security group to created VPC
resource "aws_security_group" "sg" {
  name   = "${terraform.workspace}-sg"
  vpc_id = aws_vpc.vpc.id

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
    "name" = "${terraform.workspace}-sg"
  }
}
