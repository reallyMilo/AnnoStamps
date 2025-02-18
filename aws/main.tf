terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.84.0"
    }
  }
  backend "s3" {
    bucket     = "annostamps-tf-state"
    key        = "terraform.tfstate"
    region     = "eu-central-1"
    encrypt    = true
    kms_key_id = "d7bca957-d679-4c45-9d80-722823ca3a6f"
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-central-1"
}

module "discordWebhookLambda" {
  source           = "./module/lambda"
  filename         = "./lambdas/discordWebhook/dist/discordWebhook.zip"
  description      = "A Supabase webhook triggers this Lambda on new stamp creation, which then notifies a Discord webhook to alert members."
  function_name    = "discordWebhook"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda_role
  environment_vars = { "DISCORD_WEBHOOK_URL" : var.discord_webhook_url }
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

module "updateStampDownloads" {
  source        = "./module/lambda"
  filename      = "./lambdas/updateStampDownloads/dist/updateStampDownloads.zip"
  description   = "Daily cron scheduled task that pulls google analytics data and triggers Supabase RPC that increments stamp downloads."
  function_name = "updateStampDownloads"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role
  environment_vars = {
    "SUPABASE_DB_URL" : var.supabase_db_url
    "SUPABASE_SERVICE_KEY" : var.supabase_service_key
    "GOOGLE_APPLICATION_CREDENTIALS" : "credentials.json"
  }
}

resource "aws_cloudwatch_event_rule" "daily_trigger" {
  name                = "DailyRateJob"
  description         = "Event that runs daily."
  schedule_expression = "rate(1 day)"
}
resource "aws_cloudwatch_event_target" "updateStampDownloads" {
  rule = aws_cloudwatch_event_rule.daily_trigger.id
  arn  = module.updateStampDownloads.arn
}

module "generateResponsiveImages" {
  source           = "./module/lambda"
  filename         = "./lambdas/generateResponsiveImages/dist/generateResponsiveImages.zip"
  function_name    = "generateResponsiveImages"
  description      = "Generates optimized WebP images, including thumbnails and breakpoints at 1024, 768, 640, and 250 pixels."
  runtime          = "nodejs18.x"
  role             = aws_iam_role.lambda_role
  environment_vars = {}
}

resource "aws_lambda_permission" "allow_bucket_generateResponsiveImages" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.generateResponsiveImages.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.annostamps-bucket.arn
}

module "updateImageRelation" {
  source        = "./module/lambda"
  filename      = "./lambdas/updateImageRelation/dist/updateImageRelation.zip"
  function_name = "updateImageRelation"
  description   = "Updates Supabase database relations with newly created responsive images."
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role
  environment_vars = {
    "SUPABASE_DB_URL" : var.supabase_db_url
    "SUPABASE_SERVICE_KEY" : var.supabase_service_key
  }
}

resource "aws_lambda_permission" "allow_bucket_updateImageRelation" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.updateImageRelation.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.annostamps-bucket.arn
}
import {
  to = aws_sns_topic.report_SES_fail
  id = "arn:aws:sns:eu-central-1:216548231692:ses-failure"
}

resource "aws_sns_topic" "report_SES_fail" {
  name = "ses-failure"
}

import {
  to = aws_sns_topic_subscription.email
  id = "arn:aws:sns:eu-central-1:216548231692:ses-failure:fde09acf-33d7-4d86-ad44-e57146da1c03"
}
resource "aws_sns_topic_subscription" "email" {
  protocol = "email"
  endpoint = "annostampsite@gmail.com"
  topic_arn = aws_sns_topic.report_SES_fail.arn
}
import {
  to = aws_ses_configuration_set.ses_fail
  id = "rendering-failure"
}
resource "aws_ses_configuration_set" "ses_fail" {
  name = "rendering-failure"
}

import {
  to = aws_ses_event_destination.ses_fail
  id = "rendering-failure/ses-fail"
}
resource "aws_ses_event_destination" "ses_fail" {
  name = "ses-fail"
  enabled = true
  configuration_set_name = aws_ses_configuration_set.ses_fail.name
  matching_types = ["reject", "renderingFailure", "bounce", "complaint"]

  sns_destination {
    topic_arn = aws_sns_topic.report_SES_fail.arn
  }
}

import {
  to = aws_ses_email_identity.email
  id = "annostampsite@gmail.com"
}
resource "aws_ses_email_identity" "email" {
  email = "annostampsite@gmail.com"
}

import {
  to = aws_ses_domain_identity.annostamps_com
  id = "annostamps.com"
}
resource "aws_ses_domain_identity" "annostamps_com" {
  domain = "annostamps.com"
}

import {
  to = aws_ses_domain_dkim.annostamps_com
  id = "annostamps.com"
}
resource "aws_ses_domain_dkim" "annostamps_com" {
  domain = aws_ses_domain_identity.annostamps_com.domain
}

import {
  to = aws_ses_domain_mail_from.email_annostamps_com
    id = "annostamps.com"
}
resource "aws_ses_domain_mail_from" "email_annostamps_com" {
  domain = aws_ses_domain_identity.annostamps_com.domain
  mail_from_domain = "email.${aws_ses_domain_identity.annostamps_com.domain}"
}