#!/bin/bash

# generate all our tables, functions etc from our .sql files. Does not seed the data.
# prerequisite: install psql

dir='../supabase'

host='aws-0-us-west-1.pooler.supabase.com'
port='6543'
user='postgres.SUPABASE-ID' # for YOU to replace.

if [ -z "$SUPABASE_PASSWORD" ]; then
  echo "Error: SUPABASE_PASSWORD environment variable is not set"
  exit 1
fi

export PGPASSWORD=$SUPABASE_PASSWORD

echo "Running $dir/functions.sql..."
psql -h $host -p $port -d mydb -U $user -f "$dir/functions.sql"

echo "Running all tables"
for path in "$dir"/*.sql; do
  file=$(basename "$path")
  # Skip specific files
  if [[ "$file" != "seed.sql" && "$file" != "functions.sql" && "$file" != "foreign_keys.sql" && "$file" != "views.sql" ]]; then
    echo "Running $path..."
    psql -h $host -p $port -d mydb -U $user -f "$path"
  fi
done

echo "Running $dir/foreign_keys.sql..."
psql -h $host -p $port -d mydb -U $user -f "$dir/foreign_keys.sql"

echo "Running $dir/views.sql..."
psql -h $host -p $port -d mydb -U $user -f "$dir/views.sql"
