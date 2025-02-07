# Note

Only a small number of stamps get the majority of downloads, that is why this process is batched.

Current usage statistics (Aug 2, 2024):

Average: 1-2K daily downloads

Spike (due to content creators linking stamps): 7-8K daily downloads

## Supabase setup

_service_role does not have usage permission, must set with query_

grant USAGE on schema public to service_role;

grant all on "Stamp" in schema public to service_role;

_Need to create RPC in Database -> Functions_

create function loopdownloads

```
DECLARE
    item jsonb;
    stamp_id text;
    increment_amount int;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(jsonb_collection) LOOP
        stamp_id := item->>'stampId';
        increment_amount := (item->>'increment')::int;

        RAISE LOG 'Processing item: %', item;
        RAISE LOG 'Stamp ID: %, Increment Amount: %', stamp_id,increment_amount;

        UPDATE "Stamp"
        SET downloads = downloads + increment_amount
        WHERE id = stamp_id;
    END LOOP;
END;

```

## Google Analytics setup

Add service account found in GCP Api to user in Property Access with viewer permission

Then download the credentials.json file and add to the directory.
