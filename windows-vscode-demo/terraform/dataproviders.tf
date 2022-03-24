# data provider to get information about subnet ids of a certain VPC
data "aws_subnets" "default_subnets" {
  filter {
    name   = "vpc-id"
    values = [aws_default_vpc.default_vpc.id]
  }
}


# data provider to get the latest ubuntu ami from AWS servers
data "aws_ami" "latest_windows_ami" {
  most_recent = true
  owners      = ["801119661308"] #AMI created by Microsoft
  filter {
    name   = "name"
    values = ["Windows_Server-2019-English-Full-Base-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}


data "aws_ami" "windows-vs-ami" {
  most_recent = true
  owners      = ["self"]
  filter {
    name   = "name"
    values = ["win-vs-temp-v2"]
  }
}
