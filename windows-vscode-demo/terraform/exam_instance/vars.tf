variable "vpc_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "c5.xlarge"
}

variable "ami_name" {
  type    = string
  default = "win-basic"
}

variable "admin_pass" {
  type = string
}
