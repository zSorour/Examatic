output "server-public-ip" {
  value = aws_instance.http_server.public_ip
}
