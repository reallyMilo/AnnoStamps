import {
    to = aws_s3_bucket.annostamps-bucket
    id = "annostamps"
}
resource "aws_s3_bucket" "annostamps-bucket" {
    bucket = "annostamps"
}
import {
  to = aws_s3_bucket_versioning.bucket-versioning
  id = "annostamps"
}
resource "aws_s3_bucket_versioning" "bucket-versioning" {
    bucket = aws_s3_bucket.annostamps-bucket.id
    versioning_configuration {
      status = "Enabled"
    }
}

import {
  to = aws_s3_bucket_cors_configuration.annostamps_cors
  id = "annostamps"
}
resource "aws_s3_bucket_cors_configuration" "annostamps_cors" {
  bucket = aws_s3_bucket.annostamps-bucket.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["https://annostamps.vercel.app",
      "https://annostamps.vercel.app/",
      "https://annostamps.com",
    "https://annostamps.com/"]
  }
}
