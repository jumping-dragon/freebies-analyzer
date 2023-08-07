// Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "alvinjanuar.com"
  default_tags {
    tags = {
      Owner   = "Alvin"
      Project = "test.alvinjanuar.com"
    }
  }
  # Make it faster by skipping something
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true
}

locals {
    domain_name = "test.alvinjanuar.com"
}


resource "aws_acm_certificate" "cert" {
  domain_name       = "test.alvinjanuar.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "zone" {
  name         = "alvinjanuar.com"
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  depends_on = [
    aws_acm_certificate.cert
  ]
  for_each = {
    for domain in aws_acm_certificate.cert.domain_validation_options : domain.domain_name => {
      name   = domain.resource_record_name
      record = domain.resource_record_value
      type   = domain.resource_record_type
    }
  }
  zone_id = "${data.aws_route53_zone.zone.id}"
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  ttl             = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = "${aws_acm_certificate.cert.arn}"
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

data "aws_default_tags" "default" {}

module "opennext" {
  source  = "./modules/opennext"

  prefix              = "test-alvinjanuar-com"                          # Prefix for all created resources
  opennext_build_path = "../.open-next"                     # Path to your .open-next folder
  hosted_zone_id      = data.aws_route53_zone.zone.zone_id  # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = [local.domain_name]                                             # Your domain name
    acm_certificate_arn = aws_acm_certificate_validation.cert.certificate_arn  # The ACM (SSL) certificate for your domain
  }

  default_tags = data.aws_default_tags.default.tags
}