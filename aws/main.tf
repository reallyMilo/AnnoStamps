terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.84.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-central-1"
}
import {
  to = module.discordWebhookLambda.aws_lambda_function.this
  id = "discordWebhook"
}
import {
  to = aws_lambda_function_url.discordWebhookLambda_function_url
  id = "discordWebhook"
}
import {
  to = module.discordWebhookLambda.aws_cloudwatch_log_group.this
  id = "/aws/lambda/discordWebhook"
}
module "discordWebhookLambda" {
  source = "./module/lambda"
  filename = "./lambdas/discordWebhook/dist/discordWebhook.zip"
  description = "Discord webhook lambda that notifies discord members of a newly created stamp."
  function_name = "discordWebhook"
  runtime = "nodejs20.x"
  role = aws_iam_role.lambda_role
  environment_vars = {"DISCORD_WEBHOOK_URL": var.discord_webhook_url}
}

resource "aws_lambda_function_url" "discordWebhookLambda_function_url" {
  function_name      = module.discordWebhookLambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["${var.supabase_db_url}"]
    allow_methods     = ["POST"]
    allow_headers     = ["date", "keep-alive", "auth"]
  }

}