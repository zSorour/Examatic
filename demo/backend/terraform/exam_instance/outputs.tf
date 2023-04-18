output "instance_ip" {
  value = aws_instance.windows_instance.public_ip
}

output "temp_password" {
  value = random_string.instance_password.result
}
