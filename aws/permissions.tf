data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "tf_lambda_iam_cloudwatch_logs"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

import {
  to = aws_lambda_permission.allow_cloudwatch
  id = "arn:aws:events:eu-central-1:216548231692:rule/DailyRateJob"
}
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.discordWebhookLambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_trigger.arn
}