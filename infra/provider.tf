terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Buena Práctica: Estado Remoto
  # Nota: El bucket y la tabla de DynamoDB deben crearse manualmente 
  # en la consola de AWS antes de ejecutar esto por primera vez.
  backend "s3" {
    bucket         = "hosty-tf-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "hosty-tf-state-lock"
  }
}

provider "aws" {
  region = var.aws_region
  
  # Buena Práctica: Etiquetas por defecto
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}