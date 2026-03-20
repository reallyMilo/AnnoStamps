locals {
  cdn_domain = "cdn.annostamps.com"
}

resource "aws_acm_certificate" "cdn_annostamps_com" {
  domain_name = "${local.cdn_domain}"
  validation_method = "DNS"
  provider = aws.us-east-1
}
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = aws_s3_bucket.annostamps-bucket.bucket_regional_domain_name
  }

  origin {
    origin_id   = "annostamps-site-origin"
    domain_name = "annostamps.com"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  http_version        = "http2and3"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "anno-stamps-logo.png"

  aliases = ["${local.cdn_domain}"]


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

  ordered_cache_behavior {
    path_pattern     = "/errors/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "annostamps-site-origin"

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
    acm_certificate_arn = resource.aws_acm_certificate.cdn_annostamps_com.arn
    ssl_support_method = "sni-only"
  }

  custom_error_response {
    error_code            = 400
    response_code         = 400
    response_page_path    = "/errors/400"
    error_caching_min_ttl = 120
  }

  custom_error_response {
    error_code            = 403
    response_code         = 403
    response_page_path    = "/errors/403"
    error_caching_min_ttl = 120
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/errors/404"
    error_caching_min_ttl = 120
  }

  custom_error_response {
    error_code            = 500
    response_code         = 500
    response_page_path    = "/errors/500"
    error_caching_min_ttl = 30
  }

  custom_error_response {
    error_code            = 502
    response_code         = 502
    response_page_path    = "/errors/502"
    error_caching_min_ttl = 30
  }

  custom_error_response {
    error_code            = 503
    response_code         = 503
    response_page_path    = "/errors/503"
    error_caching_min_ttl = 30
  }

  custom_error_response {
    error_code            = 504
    response_code         = 504
    response_page_path    = "/errors/504"
    error_caching_min_ttl = 30
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
