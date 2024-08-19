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
ALTER USER postgres PASSWORD 'postgres';
```

create .env in root

```sh
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/annostamps"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/annostamps"
AUTH_SECRET="openssl rand -base64 33"
```

Finally run the following commands..

```sh
pnpm i
pnpm migrate
pnpm db-seed
```

### AWS

[Eraser Diagram](https://app.eraser.io/workspace/7bgyufQrutIRtW89jbxx?origin=share)

![Create-Stamps](https://d16532dqapk4x.cloudfront.net/diagram/annostamps-create.png)

![Download-Stamp](https://d16532dqapk4x.cloudfront.net/diagram/downloads2.png)
