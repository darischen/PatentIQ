# PatentIQ AI Database

This directory contains the database initialization scripts and documentation for the PostgreSQL setup.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Running the Database
To start the PostgreSQL database container:

```bash
docker-compose up -d
```

To stop the container:

```bash
docker-compose down
```

### Initial Schema
The initial schema is defined in `init.sql`. When you start the container for the first time, PostgreSQL will automatically execute any `.sql` scripts found in the `database/` directory (mapped to `/docker-entrypoint-initdb.d/` in the container).

## Environment Variables
Ensure you have a `.env` file in the root directory (based on `.env.example`) with the following variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## PostgreSQL Tools
You can connect to the database using any standard PostgreSQL client (e.g., `psql`, pgAdmin, DBeaver) using the credentials defined in your `.env` file.
