# 0. Generamos un sufijo aleatorio para el bucket (para evitar colisiones de nombres globales)
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 1. Creamos el Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-${var.environment}-frontend-${random_id.bucket_suffix.hex}"
  # Hosty-dev-frontend-xxxxxxxx
}

# 2. Habilitamos el modo "Website"
resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html" # Clave para SPAs (React) para que el React Router maneje los 404
  }
}

# 3. Desactivamos el bloqueo de acceso público (AWS lo bloquea por defecto)
resource "aws_s3_bucket_public_access_block" "frontend_public_access" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

// ====== CloudFront =======

# 1. Creamos el Origin Access Control (OAC) para CloudFront
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "OAC-${var.project_name}-${var.environment}"
  description                       = "OAC para ${var.project_name} frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 2. Definimos la política del bucket (Solo CloudFront puede leer)
data "aws_iam_policy_document" "s3_oac_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      # Aquí está la magia: referenciamos el ARN de tu futura distribución
      values = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

# 3. Asignamos la política al bucket
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.s3_oac_policy.json
}

# 4. Creamos la Distribución de CloudFront
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    # Usamos el dominio regional del bucket (No el de website)
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = "S3-${var.project_name}-${var.environment}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-${var.environment}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # Forzamos a que todo tráfico HTTP se redirija a HTTPS
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Configuración VITAL para React/Single Page Applications
  # S3 con OAC devuelve 403 cuando no encuentra una ruta (ej: /about), 
  # CloudFront lo atrapa y sirve el index.html
  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Certificado SSL por defecto de CloudFront (te dará un dominio .cloudfront.net)
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
