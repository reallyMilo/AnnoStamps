
# Supabase database url and service key found in Supabase Dashboard -> Project Settings -> API
variable "supabase_db_url" {
  description = "Supabase database url"
  type        = string
  sensitive   = true
}
variable "supabase_service_key" {
  description = "Supabase service key, must have granted permissions, see README"
  type        = string
  sensitive   = true
}

# Discord server -> Server settings -> Integrations -> Webhooks -> Copy Webhook URL
variable "discord_webhook_url" {
  description = "Discord webhook url for the new stamp notifying."
  sensitive = true
  type = string
}