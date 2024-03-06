# NestJS Boilerplate

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

The application uses a `.env` file. Rename `.env.example` to `.env`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database

Postgres database will be available on http://localhost:5432

PgAdmin UI will be available on http://localhost:80
Connect to PgAdmin UI using:

- login in the UI (username: `admin@gadmin.com`, password: `pgadmin4`)
- host: `host.docker.internal`
- port: `5432`
- username/password/maintenance database: `postgres`
- database names: `nestjs-boilerplate-db-dev`, `nestjs-boilerplate-db-test`
