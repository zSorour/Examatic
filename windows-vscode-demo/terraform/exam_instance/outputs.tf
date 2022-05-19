output "windows_instance_public_ip" {
  value = aws_instance.windows_instance.public_ip
}

output "windows_instance_student_password" {
  value = random_string.instance_password.result
}
