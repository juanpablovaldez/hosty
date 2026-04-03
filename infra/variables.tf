variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "hosty"
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "my_ip" {
  description = "Your public IP for SSH access (e.g. 1.2.3.4/32)"
  type        = string
}

variable "ssh_public_key_path" {
  description = "Path to your SSH public key file"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "hosty_dev"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "hosty"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
