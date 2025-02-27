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



resource "aws_iam_role" "lambda_send_ses" {
  name               = "tf_lambda_cloudwatch_send_ses"
  assume_role_policy = aws_iam_role.lambda_role.assume_role_policy
}

resource "aws_iam_policy" "send_ses" {
  name = "send-ses-tf"

  policy = data.aws_iam_policy_document.send_ses.json

}

data "aws_iam_policy_document" "send_ses" {
  statement {
    actions = ["ses:SendTemplatedEmail"]
    resources = ["${aws_ses_domain_identity.annostamps_com.arn}",
      "${aws_ses_template.comment_notification_template.arn}",
      "${aws_ses_configuration_set.ses_fail.arn}"
    ]
  }
  depends_on = [aws_ses_domain_identity.annostamps_com, aws_ses_template.comment_notification_template, aws_ses_configuration_set.ses_fail]
}

resource "aws_iam_role_policy_attachment" "attach_send_ses" {
  role       = aws_iam_role.lambda_send_ses.name
  policy_arn = aws_iam_policy.send_ses.arn
}
