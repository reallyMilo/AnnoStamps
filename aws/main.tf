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

module "discordWebhookLambda" {
  source = "./module/lambda"
  filename = "./lambdas/discordWebhook/dist/discordWebhook.zip"
  description = "A Supabase webhook triggers this Lambda on new stamp creation, which then notifies a Discord webhook to alert members."
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
import {
  to = module.updateStampDownloads.aws_lambda_function.this
  id = "updateStampDownloads"
}

module "updateStampDownloads" {
  source = "./module/lambda"
  filename = "./lambdas/updateStampDownloads/dist/updateStampDownloads.zip"
  description = "Daily cron scheduled task that pulls google analytics data and triggers Supabase RPC that increments stamp downloads."
  function_name = "updateStampDownloads"
  runtime = "nodejs20.x"
  role = aws_iam_role.lambda_role
  environment_vars = {
    "SUPABASE_DB_URL": var.supabase_db_url
    "SUPABASE_SERVICE_KEY": var.supabase_service_key
    "GOOGLE_APPLICATION_CREDENTIALS": "credentials.json"
  }
}

import {
  to = aws_cloudwatch_event_rule.daily_trigger
  id = "arn:aws:events:eu-central-1:216548231692:rule/DailyRateJob"
}
resource "aws_cloudwatch_event_rule" "daily_trigger" {
  name = "DailyRateJob"
  description = "Event that runs daily."
  schedule_expression = "rate (1 day)"
}

import {
  to = aws_cloudwatch_event_target.target_updateStampDownloads
  id = "arn:aws:events:eu-central-1:216548231692:rule/DailyRateJob"
}
resource "aws_cloudwatch_event_target" "target_updateStampDownloads" {
  rule = aws_cloudwatch_event_rule.daily_trigger.name
  target_id = "DailyRateJob"
  arn = module.updateStampDownloads.arn
}