#!/bin/bash

(
# Set your database connection details
export PGPASSWORD=$SUPABASE_PASSWORD

# Target database connection info - replace with your target DB
DB_NAME="db.gxbejryrwhsmuailcdur.supabase.co"
DB_USER="postgres"
PORT="5432"

psql -U $DB_USER -d postgres -h $DB_NAME -p $PORT -w \
-f ../supabase/functions.sql 

psql -U $DB_USER -d postgres -h $DB_NAME -p $PORT -w \
-f ./dev-love-dump.sql \
-f ../supabase/private_users.sql \
-f ../supabase/users.sql

psql -U $DB_USER -d postgres -h $DB_NAME -p $PORT -w \
-f ./import-love-finalize.sql \
-f ../supabase/private_user_messages.sql

echo "Love tables import completed successfully!"
)