provider "aws" {

  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    lambda         = "http://localhost:4566"
    s3             = "http://s3.localhost.localstack.cloud:4566"
  }
}


module "generateResponsiveImages" {
  source           = "./module/lambda"
  filename         = "../lambdas/generateResponsiveImages/dist/generateResponsiveImages.zip"
  function_name    = "generateResponsiveImages"
  description      = "Generates optimized WebP images, including thumbnails and breakpoints at 1024, 768, 640, and 250 pixels."
  runtime          = "nodejs18.x"
  role             = aws_iam_role.lambda_s3_access
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
  filename      = "../lambdas/updateImageRelation/dist/updateImageRelation.zip"
  function_name = "updateImageRelation"
  description   = "Updates Supabase database relations with newly created responsive images."
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_s3_access
  environment_vars = {
    "SUPABASE_DB_URL" : var.supabase_db_url
    "SUPABASE_SERVICE_KEY" : var.supabase_service_key
    "CLOUDFRONT_CDN_URL" : "${aws_s3_bucket.annostamps-bucket.bucket_domain_name}/"
  }
}

resource "aws_lambda_permission" "allow_bucket_updateImageRelation" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.updateImageRelation.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.annostamps-bucket.arn
}

module "generateAvatarAndUpdateDb" {

  source        = "./module/lambda"
  filename      = "../lambdas/generateAvatarAndUpdateDb/dist/generateAvatarAndUpdateDb.zip"
  function_name = "generateAvatarAndUpdateDb"
  description   = "Generates 128x128 avatar for user profiles and updates User relation in database."
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_s3_access


  environment_vars = {
    "SUPABASE_DB_URL" : var.supabase_db_url
    "SUPABASE_SERVICE_KEY" : var.supabase_service_key
    "CLOUDFRONT_CDN_URL" : "${aws_s3_bucket.annostamps-bucket.bucket_domain_name}/"
  }
}

resource "aws_lambda_permission" "allow_bucket_generateAvatarAndUpdateDb" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.generateAvatarAndUpdateDb.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.annostamps-bucket.arn
}
