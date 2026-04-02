# 1. Obtenemos la AMI de Ubuntu 22.04 más reciente automáticamente
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # ID oficial de Canonical (creadores de Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 2. Obtenemos la VPC por defecto de tu cuenta de AWS
data "aws_vpc" "default" {
  default = true
}

# 3. Creamos el par de llaves SSH para acceder al servidor
resource "aws_key_pair" "deployer_key" {
  key_name   = "${var.project_name}-${var.environment}-key"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

# 4. Creamos el Security Group
resource "aws_security_group" "backend_sg" {
  name        = "${var.project_name}-${var.environment}-backend-sg"
  description = "Allow web, SSH, and Node.js development traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH (Solo desde tu IP)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  ingress {
    description = "HTTP (Trafico web normal)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (Trafico web seguro)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Node.js Port (Para pruebas directas)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Permitir que el servidor salga a internet (ej. para descargar paquetes npm)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 5. Creamos la instancia EC2
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.deployer_key.key_name
  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  # Bootstrap: instala Node.js, pnpm y pm2 al primer arranque
  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs git
    npm install -g pnpm pm2
    # Configura pm2 para arrancar con el sistema
    env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
    systemctl enable pm2-ubuntu
  EOF
  )

  tags = {
    Name = "${var.project_name}-${var.environment}-backend"
  }
}

# Asignamos una IP Elástica (Fija)
resource "aws_eip" "backend_ip" {
  instance = aws_instance.backend.id
  domain   = "vpc"
}

