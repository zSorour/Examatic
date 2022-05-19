# get information about subnet ids of a certain VPC
data "aws_subnets" "default_subnets" {
  filter {
    name   = "vpc-id"
    values = [aws_default_vpc.default_vpc.id]
  }
}

# get desired ami 
data "aws_ami" "target_ami" {
  most_recent = true
  owners      = ["self"]
  filter {
    name   = "name"
    values = [var.ami_name]
  }
}
