packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "region" {
  type    = string
  default = "eu-central-1"
}

# source blocks are generated from builders;
source "amazon-ebs" "ubuntu-basic" {
  shared_credentials_file = "~/.aws/creds"
  ami_name                = "ubuntu-basic"
  instance_type           = "c5.xlarge"
  launch_block_device_mappings {
    device_name = "/dev/sda1"
    volume_size = 100
    delete_on_termination = true
}
  region                  = "${var.region}"
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["679593333241"]
  }
  communicator     = "ssh"
  ssh_username = "ubuntu"
  force_deregister = true
}

# a build block invokes sources and runs provisioning steps on them.
build {
  name    = "ubuntu-basic-builder"
  sources = ["source.amazon-ebs.ubuntu-basic"]

  provisioner "ansible" {
    playbook_file = "./ansible/main.yml"
  }
}