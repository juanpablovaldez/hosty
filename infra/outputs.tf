output "cloudfront_domain" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "backend_public_ip" {
  description = "La IP publica y fija de tu servidor backend"
  value       = aws_eip.backend_ip.public_ip
}

output "backend_sg_id" {
  description = "ID del Security Group del backend"
  value       = aws_security_group.backend_sg.id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_sg_id" {
  description = "ID del Security Group de RDS"
  value       = aws_security_group.rds_sg.id
}
