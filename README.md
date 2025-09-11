<div align="center">
  <a href="https://annostamps.com">
    <img src="https://annostamps.com/anno-stamps-logo.svg" 
    width="420px"
    alt="Logo">
  </a>

<h3 align="center">Upload and share stamps for the Anno franchise.</h3>

  <p align="center">
    <a href="https://discord.gg/73hfP54qXe"><strong>Join the Discord »</strong></a>
  </p>
</div>

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/)

- [Node 22.x](https://nodejs.org/en/download)

- [pnpm](https://pnpm.io/installation)

### Installation

1. Clone the repo

   ```bash
   git clone https://github.com/reallyMilo/AnnoStamps.git
   ```

2. Install dependencies, apply the prisma schema to the database and optionally seed the database.

   ```bash
   pnpm i
   pnpm migrate
   pnpm db-seed
   ```

3. (Optional) Add Discord authentication to test out provider login and user features.
   1. Use your Discord account to create an [application](https://discord.com/developers/applications).

   2. Copy the CLIENT ID and CLIENT SECRET values from OAuth2.

   3. Add them to the env variables.

   ```bash
   AUTH_DISCORD_ID=
   AUTH_DISCORD_SECRET=
   ```

## Contributing

Any contributions you make are **greatly appreciated**.

## Contact

Join the [Discord](https://discord.gg/73hfP54qXe).
