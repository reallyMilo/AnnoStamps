
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

variable "discord_webhook_url" {
  sensitive = true
  type = string
  description = "Discord webhook url for the new stamp notifying."
}