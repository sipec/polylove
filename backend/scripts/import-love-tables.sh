#!/bin/bash

(
# Set your database connection details
export PGPASSWORD=$SUPABASE_PASSWORD

# Target database connection info - replace with your target DB

# DB_NAME="db.gxbejryrwhsmuailcdur.supabase.co" # dev
DB_NAME="db.lltoaluoavlzrgjplire.supabase.co" # prod
DB_USER="postgres"
PORT="5432"

psql -U $DB_USER -d postgres -h $DB_NAME -p $PORT -w \
-f ../supabase/private_users.sql \
-f ../supabase/users.sql

echo "Love tables import completed successfully!"
)