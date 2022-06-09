variable "digital_ocean_token__env" {
  description = "value of the DigitalOcean API token"
}

variable "docker_image" {
  type        = string
  description = "Specifies the docker image to use in the pods"
}

variable "mongoURI__env" {
  type        = string
  description = "Specifies the mongoURI to use for the container env variable"
}

variable "port__env" {
  type        = number
  description = "Specifies the port to use for the container env variable"
}

variable "jwt_secret__env" {
  type        = string
  description = "Specifies the jwt secret to use for the container env variable"
}

variable "aws_access_key_id__env" {
  type        = string
  description = "Specifies the aws access key id to use for the container env variable"
}

variable "aws_secret_access_key__env" {
  type        = string
  description = "Specifies the aws secret access key to use for the container env variable"
}

variable "admin_password__env" {
  type        = string
  description = "Specifies the admin password to use for the container env variable"
}
