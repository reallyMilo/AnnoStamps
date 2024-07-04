## AWS

_Lambda -> Functions -> googleAnalyticsToDb -> Configuration_

### Trigger

Source: EventBridge

Schedule expression: rate(1 day) // UTC+0

### Environment Variables

_Supabase UI -> Project Settings -> API_

SUPA_DB

SUPA_SERVICE_KEY

_Google Cloud Dashboard -> APIs & Services -> Enabled APIs -> Google Analytics Data API -> Credentials_

GOOGLE_APPLICATION_CREDENTIALS = credentials.json

## Supabase

_service_role does not have usage permission, must set with query_

grant USAGE on schema public to service_role;

grant all on "Stamp" in schema public to service_role;

_Need to create RPC in Database -> Functions_

incdownloads

update "Stamp"
set downloads = downloads + increment_amount
where id = row_id

## Google Analytics

Add service account found in GCP Api to user in Property Access with viewer permission
