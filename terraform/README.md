# AWS Infra with Terraform

1. [Terraform Install Guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build)

2. [AWS CLI Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

3. Create secrets.tfvars and populate with correct values. These can be found in the state file for terraform in s3 or going to the resource that will have them.

4. Run the following commands

   `terraform init`

   `terraform plan -var-file=secrets.tfvars`

   `terraform apply -var-file=secrets.tfvars`

### AWS

[Eraser Diagram](https://app.eraser.io/workspace/7bgyufQrutIRtW89jbxx?origin=share)

![Create-Stamps](https://d16532dqapk4x.cloudfront.net/diagram/annostamps-create.png)

![Download-Stamp](https://d16532dqapk4x.cloudfront.net/diagram/downloads2.png)
