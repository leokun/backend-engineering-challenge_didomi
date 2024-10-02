

## Description

Backend engineering challenge for a job interview with [Didomi](https://www.didomi.io/fr).
> See details [here](./Challenge.md)

This is a **NestJS** application, I am also using **Prisma** as ORM/ModelBuilder.

## Requirements

- **docker** and **docker compose**
- nodejs version >= 15 (use of crypto.randomUUID)

For testing purpose I use **VSCode** with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin. (See `./test-api.rest` file).   
Also Docker lanches a PostgreSQL database.

## Installation
> I personnaly use `pnpm` but you can pick an other node package manager

```bash
$ pnpm install
```

## Running the app

```bash
# development with watch mode
$ pnpm run start:dev

# Apply Prisma migrations
$ pnpm prisma migrate dev

# Reset Prisma migrations and start fresh
$ pnpm prisma migrate reset dev
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e
```

### With REST Client

In VSCode you can open the `./test-api.rest` file and then run api call by clicking on the ***Send Request*** link over the REST command

> ***Warning !***   
> e2e tests and REST Client tests are using the PostgreSQL database.   
> When unit testing are using an InMemory database (except for `src/db/db.service.spec.ts`) which don't need to be erased if something went wrong during tests.

