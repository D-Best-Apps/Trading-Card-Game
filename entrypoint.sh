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

# Grant permissions to the user. This is more reliable than relying on the image's default user creation.
echo "Database is up, ensuring user permissions..."
mariadb -h db -u root -p"$DB_ROOT_PASSWORD" --ssl=0 <<-EOSQL
    CREATE DATABASE IF NOT EXISTS `$DB_DATABASE`;
    CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
    GRANT ALL PRIVILEGES ON `$DB_DATABASE`.* TO '$DB_USER'@'%';
    FLUSH PRIVILEGES;
EOSQL

# Execute the SQL scripts in the correct order
echo "Running setup scripts..."

mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/DB-Structure.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/DB-Admin-Structure.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/Card-Details.sql
mariadb -h db -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" --ssl=0 < /Container/Clues-Data.sql

echo "Database setup complete."

# Execute the main command (e.g., "node server.js")
exec "$@"
