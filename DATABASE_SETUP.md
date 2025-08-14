# PAWhere Landing Page - Database Setup

This guide helps you set up the PostgreSQL database for the PAWhere landing page using Docker.

## Quick Start

1. **Start the database**:
   ```bash
   docker-compose up -d
   ```

2. **Stop the database**:
   ```bash
   docker-compose down
   ```

3. **View logs**:
   ```bash
   docker-compose logs postgres
   ```

## Database Configuration

- **Database Name**: `pawherelandingpage`
- **Username**: `pawhere`
- **Password**: `pawhere`
- **Host**: `localhost`
- **Port**: `5439`

## Connection Details

### For Applications
```
DATABASE_URL=postgresql://pawhere:pawhere@localhost:5439/pawherelandingpage
```

### For Database Tools
- **Host**: `localhost`
- **Port**: `5439`
- **Database**: `pawherelandingpage`
- **Username**: `pawhere`
- **Password**: `pawhere`

## PgAdmin Access

The setup includes PgAdmin for database management:

- **URL**: http://localhost:8081
- **Email**: pawhere@gmail.com
- **Password**: pawhere

### Adding Server in PgAdmin
1. Login to PgAdmin at http://localhost:8081
2. Right-click "Servers" → "Create" → "Server"
3. **General Tab**: Name = "PAWhere DB"
4. **Connection Tab**:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `pawherelandingpage`
   - Username: `pawhere`
   - Password: `pawhere`

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This ensures your data persists even when containers are stopped or removed.

## Environment Variables

When connecting your application, use these environment variables:

```bash
PGHOST=localhost
PGPORT=5439
PGDATABASE=pawherelandingpage
PGUSER=pawhere
PGPASSWORD=pawhere
DATABASE_URL=postgresql://pawhere:pawhere@localhost:5439/pawherelandingpage
```

## Troubleshooting

### Port Already in Use
If port 5439 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "5440:5432"  # Change 5439 to any available port
```

### Reset Database
To completely reset the database:
```bash
docker-compose down
docker volume rm pawhere_postgres_data
docker-compose up -d
```

## Team Collaboration

1. Share this `docker-compose.yml` file with your team
2. Everyone runs `docker-compose up -d` to start their local database
3. Use the same database migrations to keep schemas in sync
4. Each team member has their own isolated database instance