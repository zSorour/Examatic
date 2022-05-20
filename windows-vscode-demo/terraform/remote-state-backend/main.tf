terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region                   = "eu-central-1"
  shared_credentials_files = ["/home/zsorour/.aws/creds"]
}


# CREATE S3 BUCKET TO STORE STATE REMOTELY
resource "aws_s3_bucket" "remote_backend_state" {
  bucket = "186081-gp-tf-backend-state"
  lifecycle {
    prevent_destroy = true
  }
}

# ENABLE VERSIONING ON THE S3 BUCKET
resource "aws_s3_bucket_versioning" "remote_backend_versioning" {
  bucket = aws_s3_bucket.remote_backend_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ENABLE SERVER SIDE ENCRYPTION
resource "aws_s3_bucket_server_side_encryption_configuration" "remote_backend_ss-encryption" {
  bucket = aws_s3_bucket.remote_backend_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# UTILIZE REMOTE-STATE LOCKING FOR CONCURRENT TERRAFORM RUNS
# SETUP A DYNAMODB TABLE. TERRAFORM WILL USE THIS FOR STATE LOCKING
resource "aws_dynamodb_table" "remote_backend_state_lock" {
  name         = "186081-gp-tf-backend-state_locks"
  billing_mode = "PAY_PER_REQUEST"


  # LockID hash_key and attribute name are reserved for Terraform to function properly

  hash_key = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
