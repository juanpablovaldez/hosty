terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state in S3 with DynamoDB locking.
  # The S3 bucket and DynamoDB table must be created manually before the first run.
  #
  # The `key` is intentionally omitted here — pass it per environment at init time:
  #   terraform init -backend-config=config/dev.hcl
  #   terraform init -backend-config=config/stg.hcl
  backend "s3" {
    bucket         = "hosty-tf-state"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "hosty-tf-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}
