# How to update the templates

//TODO aws account setup docs in main directory with IAM etc...

1. [Follow the AWS CLI install guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)

2. [Docs for IAM user CLI access (not best practice)](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-get)

From the above link, when running `aws configure` make sure you leave role_arn blank, only set the what is shown in the docs.

then run

`aws ses create-template --cli-input-json file://comment-notification-template.json`

Delete the created access key from admin account.
