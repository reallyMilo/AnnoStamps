resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name
  }

  http_version        = "http2and3"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "anno-stamps-logo.png"


  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name


    smooth_streaming = false
    compress         = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.MangedCachingOptimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.policy.id
    viewer_protocol_policy     = "redirect-to-https"

  }
  #PriceClass_100 = North America and Europe only
  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "${aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name}-signed"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  origin_access_control_origin_type = "s3"
}

resource "aws_cloudfront_response_headers_policy" "policy" {
  name = "allowAnnostamps"

  cors_config {
    access_control_allow_credentials = false
    access_control_max_age_sec       = 600
    origin_override                  = true
    access_control_allow_headers {
      items = ["annostamps.com"]
    }

    access_control_allow_methods {
      items = ["ALL"]
    }
    access_control_allow_origins {
      items = ["https://annostamps.com"]
    }

  }
}


data "aws_cloudfront_cache_policy" "MangedCachingOptimized" {
  id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
}

