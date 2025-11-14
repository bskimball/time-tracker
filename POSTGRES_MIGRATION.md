# PostgreSQL Migration Guide

This guide walks you through migrating from MySQL to PostgreSQL with database seeding.

## What's Included

The seed script (`prisma/seed.ts`) creates:

- **7 Stations**: PICKING, PACKING, FILLING, RECEIVING, SHIPPING, QUALITY, INVENTORY
- **12 Employees**: 10 active, 1 on leave, 1 inactive
- **7 Task Types**: One for each station with estimated completion times
- **3 Users**: Admin, Manager, Worker roles

### Login Credentials

- **Admin**: admin@warehouse.com
- **Manager**: manager@warehouse.com
- **Worker**: worker@warehouse.com
- **Employee PIN**: 1234 (for all employees at kiosk)

## Migration Steps

### 1. Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Update Environment Variables

Edit `.env`:

```env
# PostgreSQL connection
DATABASE_URL="postgresql://user:password@postgres:5432/myapp"

# PostgreSQL environment variables
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=myapp
```

### 3. Update Docker Compose

Edit `docker-compose.yml`:

```yaml
services:
  postgres: # Changed from mysql
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app-dev:
    # ... other config unchanged ...
    depends_on:
      - postgres # Changed from mysql

  app-prod:
    # ... other config unchanged ...
    depends_on:
      - postgres # Changed from mysql

volumes:
  postgres_data: # Changed from mysql_data
```

### 4. Remove Old MySQL Data (Optional)

If you want to completely remove MySQL:

```bash
# Stop containers
docker-compose down

# Remove MySQL volume
docker volume rm rsc-hono-app_mysql_data

# Remove MySQL image (optional)
docker rmi mysql:8.0
```

### 5. Start PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Wait a few seconds for PostgreSQL to initialize
```

### 6. Push Schema and Seed Database

Option A: Using `db push` (recommended for development):

```bash
# Push schema to create tables
npx prisma db push

# Seed the database
npm run db:seed
```

Option B: Using migrations (recommended for production):

```bash
# Create initial migration
npx prisma migrate dev --name init

# Seed will run automatically after migration
# Or run manually: npm run db:seed
```

### 7. Start Your Application

```bash
# Development
npm run dev

# Or with Docker
docker-compose --profile dev up
```

## Seeding Commands

The seeder can be run anytime to reset your database:

```bash
# Run the seeder manually
npm run db:seed

# Or using Prisma's built-in command
npx prisma db seed
```

**Warning**: The seeder will DELETE all existing data before inserting new seed data.

## Verification

After migration, verify everything works:

1. **Check database connection**:

   ```bash
   npx prisma studio
   ```

   This opens a GUI to browse your data at http://localhost:5555

2. **Check application**:
   - Start the dev server: `npm run dev`
   - Visit: http://localhost:5173
   - Try logging in with the test accounts

3. **Check time clock**:
   - Visit: http://localhost:5173/time-clock
   - Try clocking in with PIN: 1234
   - Any employee code (EMP001-EMP012) should work

## Rollback (if needed)

If you need to go back to MySQL:

1. Change `prisma/schema.prisma` back to `provider = "mysql"`
2. Update `.env` with MySQL connection string
3. Update `docker-compose.yml` back to MySQL service
4. Run `docker-compose up -d mysql`
5. Run `npx prisma db push && npm run db:seed`

## Differences: MySQL vs PostgreSQL

### Advantages of PostgreSQL

- Better JSON/JSONB support for complex data
- Advanced indexing (GIN, GiST, BRIN)
- Native UUID type
- Better full-text search
- More SQL standard compliant
- Better performance for complex queries
- Excellent support for analytics

### Compatibility Notes

Your application is already compatible because:

- ✅ All queries use Prisma ORM (database-agnostic)
- ✅ No raw SQL that's MySQL-specific
- ✅ No MySQL-specific features being used
- ✅ All data types are compatible

## Troubleshooting

### Connection refused

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs postgres
```

### Permission denied

```bash
# Ensure .env has correct credentials
# PostgreSQL is more strict about permissions
```

### Schema sync issues

```bash
# Force reset (DEVELOPMENT ONLY - destroys data)
npx prisma db push --force-reset

# Then reseed
npm run db:seed
```

## Production Deployment

For production:

1. Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
2. Use migrations instead of `db push`:
   ```bash
   npx prisma migrate deploy
   ```
3. Don't run the seeder in production
4. Back up data before any migration

## Need Help?

- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Check `prisma/seed.ts` to customize seed data
