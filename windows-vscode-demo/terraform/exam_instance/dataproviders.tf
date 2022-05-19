# get desired security group
data "aws_security_group" "sg" {
  id = var.security_group_id
}


# get information about subnet ids of a certain VPC
data "aws_subnets" "vpc_subnets" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
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
