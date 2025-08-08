#!/bin/sh
# entrypoint.sh

# Abort on any error
set -e

# Wait for the database to be ready
until nc -z -v -w30 db 3306; do
 echo "Waiting for database connection..."
 # wait for 5 seconds before check again
 sleep 5
done

# Execute the SQL scripts in the correct order
echo "Database is up, running setup scripts..."

mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/DB-Structure.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/DB-Admin-Structure.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/Card-Details.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/Clues-Data.sql

echo "Database setup complete."

# Execute the main command (e.g., "node server.js")
exec "$@"
