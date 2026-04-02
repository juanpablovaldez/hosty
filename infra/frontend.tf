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

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 4. Política de Bucket para permitir que cualquiera lea los archivos
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      },
    ]
  })
  
  # Nos aseguramos de que el bloqueo público se quite ANTES de aplicar esta política
  depends_on = [aws_s3_bucket_public_access_block.frontend_public_access]
}