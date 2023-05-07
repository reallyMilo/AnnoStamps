[![Anno Stamps](https://annostamps.com/anno-stamps-logo.svg)](https://annostamps.com/)

A site for uploading and sharing stamps for Anno 1800
[Anno Stamps](https://annostamps.com).

pnpm i

[install postgres](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)

sudo systemctl status postgresql command to check your postgres is running

CREATE DATABASE annostamps;
GRANT ALL PRIVILEGES ON DATABASE annostamps TO postgres;

create .env.local in root add
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/annostamps"

```sh
pnpm build:db
```
