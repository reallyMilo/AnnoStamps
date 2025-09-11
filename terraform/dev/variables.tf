
# Supabase database url and service key found in Supabase Dashboard -> Project Settings -> API
variable "supabase_db_url" {
  description = "Supabase database url"
  type        = string
  default = "value"
}
variable "supabase_service_key" {
  description = "Supabase service key, must have granted permissions, see README"
  type        = string
  default = "value"
}

# Discord server -> Server settings -> Integrations -> Webhooks -> Copy Webhook URL
variable "discord_webhook_1800_url" {
  description = "Discord webhook url for the new stamp notifying."
  type        = string
  default = "value"
}

variable "discord_webhook_117_url" {
  description = "Discord webhook url for the new stamp notifying."
  type        = string
  default = "value"
}

variable "annostamps_user_arn" {
  description = "Full arn of IAM user that is used by the web application to access s3 resources."
  type        = string
  default = "annostamps"
}