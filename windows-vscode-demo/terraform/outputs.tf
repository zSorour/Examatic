output "windows_instance_public_ip" {
  value = aws_instance.windows_instance.public_ip
}