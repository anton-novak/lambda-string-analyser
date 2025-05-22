variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "environment" {
  description = "dev/prod"
  type        = string
}

variable "zip_file" {
  type    = string
  default = "../build/lambda-bundle.zip"
}

variable "lambda_timeout" {
  type    = number
}

variable "lambda_memory_size" {
  type    = number
}