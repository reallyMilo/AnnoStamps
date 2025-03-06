
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
  lambda_function {
    lambda_function_arn = module.generateAvatarAndUpdateDb.arn
    events              = ["s3:ObjectCreated:Put"]
    filter_prefix       = "avatar/"
  }

  depends_on = [aws_lambda_permission.allow_bucket_generateResponsiveImages,
  aws_lambda_permission.allow_bucket_updateImageRelation]

}

resource "aws_s3_bucket_policy" "cloudfront_web_app_access" {
  bucket = aws_s3_bucket.annostamps-bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.annostamps-bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" : aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      },
      {
        "Sid" : "Stmt1696707166060",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : var.annostamps_user_arn
        },
        "Action" : "s3:*",
        "Resource" : [
          "arn:aws:s3:::annostamps/*",
          "arn:aws:s3:::annostamps"
        ]
      }
    ]
  })
}
