[![Anno Stamps](https://annostamps.com/anno-stamps-logo.svg)](https://annostamps.com/)

A site for uploading and sharing stamps for Anno 1800
[Anno Stamps](https://annostamps.com).

### Setup local environment

[install postgres](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)

Use the guide above to install postgres then run the following commands

```bash
sudo -u postgres psql
CREATE DATABASE annostamps;
GRANT ALL PRIVILEGES ON DATABASE annostamps TO postgres;
```

create .env in root with, default is postgres:postgres
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/annostamps"

```sh
pnpm i
pnpm migrate
```
