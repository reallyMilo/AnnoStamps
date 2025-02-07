variable "function_name" {}
variable "filename" {}
variable "role" {
  type = object({
    name = string
    arn  = string
  })
}
variable "description" {}
variable "runtime" {}

variable "environment_vars" {
  type = map(string)
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
  lifecycle {
    prevent_destroy = true
  }
}
data "aws_iam_policy" "lambda_basic_execution_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = var.role.name
  policy_arn = data.aws_iam_policy.lambda_basic_execution_policy.arn
}


resource "aws_lambda_function" "this" {
  filename         = var.filename
  source_code_hash = filebase64sha256(var.filename)
  description      = var.description
  function_name    = var.function_name
  role             = var.role.arn
  handler          = "index.handler"
  runtime          = var.runtime
  memory_size      = 128
  timeout          = 300
  depends_on       = [aws_cloudwatch_log_group.this, aws_iam_role_policy_attachment.lambda_logs]
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
