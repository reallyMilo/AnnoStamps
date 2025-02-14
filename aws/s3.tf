
resource "aws_s3_bucket" "annostamps-bucket" {
  bucket = "annostamps"
}

resource "aws_s3_bucket_versioning" "bucket-versioning" {
  bucket = aws_s3_bucket.annostamps-bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "annostamps_cors" {
  bucket = aws_s3_bucket.annostamps-bucket.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://annostamps.vercel.app",
      "https://annostamps.vercel.app/",
      "https://annostamps.com",
    "https://annostamps.com/"]
  }
}

resource "aws_s3_bucket_notification" "bucket_notifications" {
  bucket = aws_s3_bucket.annostamps-bucket.id
  lambda_function {
    lambda_function_arn = module.generateResponsiveImages.arn
    events              = ["s3:ObjectCreated:Put"]
    filter_prefix       = "images/"
  }
  lambda_function {
    lambda_function_arn = module.updateImageRelation.arn
    events              = ["s3:ObjectCreated:Put"]
    filter_prefix       = "responsive/"
  }

  depends_on = [aws_lambda_permission.allow_bucket_generateResponsiveImages,
   aws_lambda_permission.allow_bucket_updateImageRelation]


}