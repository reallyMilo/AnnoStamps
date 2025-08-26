variable "function_name" {}
variable "filename" {}

variable "description" {}
variable "runtime" {}

variable "environment_vars" {
  type = map(string)
}

resource "aws_lambda_function" "this" {
  filename         = var.filename
  source_code_hash = filebase64sha256(var.filename)
  description      = var.description
  function_name    = var.function_name
  role             = "arn:aws:iam::000000000000:role/lambda-role"
  handler          = "index.handler"
  runtime          = var.runtime
  memory_size      = 128
  timeout          = 300
  environment {
    variables = var.environment_vars
  }
}

output "function_name" {
  value = aws_lambda_function.this.function_name
}
output "arn" {
  value = aws_lambda_function.this.arn
}
