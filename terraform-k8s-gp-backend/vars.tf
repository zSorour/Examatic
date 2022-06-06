variable "digital_ocean_token" {
  description = "value of the DigitalOcean API token"
  default     = "dop_v1_967082bcc634e17d32d92e9aa5ffaac258105d39a43606a80b58659f1c96e21a"
}

variable "node_count" {
  type        = number
  default     = 3
  description = "Specifies the number of nodes to create in the cluster"
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
