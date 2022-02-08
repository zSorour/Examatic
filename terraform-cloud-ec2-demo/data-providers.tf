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
