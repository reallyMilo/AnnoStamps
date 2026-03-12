# Agents Guide

## Repo Summary

AnnoStamps is a Next.js 16 (App Router) app for sharing Anno game stamps. The stack uses React 19, TypeScript, Tailwind CSS, Prisma, and Postgres (via Docker). Auth and storage integrations include Better Auth, Discord/Google, Supabase, and AWS S3/LocalStack.

## Setup

1. Install Node version from package.json engine:node version, and pnpm.
2. Rename `.env.example` to `.env` and `.env.test` to `.env.production`
3. Start Postgres and Localstack:
   `docker compose --profile localstack up`
   `terraform -chdir=./terraform/dev init`
   `terraform -chdir=./terraform/dev apply -auto-approve`
4. Install dependencies, migrate and seed:
   `pnpm i`
   `pnpm migrate`
   `pnpm db-seed`

## Common Commands

- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start prod: `pnpm start`
- Lint: `pnpm lint`
- Tests (unit): `pnpm test`
- Tests (e2e): `pnpm test:e2e`

## Project Layout

- `src/app/`: Next.js App Router routes
- `src/components/`: shared UI components
- `src/lib/`: utilities, services, and helpers
- `src/auth.ts`: auth configuration
- `src/view/`: view-layer helpers
- `prisma/schema.prisma`: database schema
- `prisma/seed.ts`: seed data
- `cypress/`: e2e tests

## Agent Notes

- Prefer `pnpm` for all tasks (lockfile is `pnpm-lock.yaml`).
- If you change database schema, run `pnpm migrate` (includes Prisma generate).
- Keep changes aligned with existing TypeScript and ESLint rules.
