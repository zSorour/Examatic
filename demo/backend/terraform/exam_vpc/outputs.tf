output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "sg_id" {
  value = aws_security_group.sg.id
}
