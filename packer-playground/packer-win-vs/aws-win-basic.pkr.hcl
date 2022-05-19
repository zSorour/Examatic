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
source "amazon-ebs" "win-basic" {
  shared_credentials_file = "~/.aws/creds"
  ami_name                = "win-basic"
  instance_type           = "c5.xlarge"
  launch_block_device_mappings {
    device_name = "/dev/sda1"
    volume_size = 100
    delete_on_termination = true
}
  region                  = "${var.region}"
  source_ami_filter {
    filters = {
      name                = "Windows_Server-2019-English-Full-Base-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["801119661308"]
  }
  user_data_file   = "bootstrap_win.txt"
  communicator     = "winrm"
  force_deregister = true
  winrm_insecure   = true
  winrm_username   = "Administrator"
  winrm_use_ssl    = true

}

# a build block invokes sources and runs provisioning steps on them.
build {
  name    = "win-basic-builder"
  sources = ["source.amazon-ebs.win-basic"]

  provisioner "ansible" {
    user             = "Administrator"
    use_proxy        = false
    ansible_env_vars = ["WINRM_PASSWORD={{.WinRMPassword}}"]

    extra_arguments = [
      "-e",
      "ansible_winrm_server_cert_validation=ignore",
      "--connection", "packer",
      "--extra-vars", "winrm_password=${build.Password}",
      "-vvv"
    ]
    playbook_file = "./ansible/main.yml"
  }

}