## AWS

### Trigger

Event type: s3:ObjectCreated:Put

Prefix: responsive/

### Environment Variables

_Supabase UI -> Project Settings -> API_

SUPA_DB

SUPA_SERVICE_KEY

## Supabase

grant USAGE on schema public to service_role;

grant all on "Image" in schema public to service_role;
