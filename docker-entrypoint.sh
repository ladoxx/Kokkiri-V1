#!/bin/sh
set -e

# Ensure runtime directories exist
mkdir -p /app/data /app/prisma /app/public/uploads

# 1. If /app/data is empty (e.g., fresh Coolify volume mount), initialize default JSON configs
if [ ! -f /app/data/company-info.json ] && [ -d /app/data-template ]; then
  echo "=> [KOKKIRI] Initializing /app/data from template..."
  cp -r /app/data-template/* /app/data/ 2>/dev/null || true
fi

# 2. Check /app/prisma/kokkiri.db integrity
INIT_DB=false
if [ ! -f /app/prisma/kokkiri.db ]; then
  echo "=> [KOKKIRI] Database file /app/prisma/kokkiri.db not found."
  INIT_DB=true
else
  DB_SIZE=$(wc -c /app/prisma/kokkiri.db 2>/dev/null | awk '{print $1}')
  if [ -z "$DB_SIZE" ] || [ "$DB_SIZE" -lt 5000 ]; then
    echo "=> [KOKKIRI] Database file is uninitialized or too small ($DB_SIZE bytes)."
    INIT_DB=true
  fi
fi

if [ "$INIT_DB" = "true" ] && [ -f /app/prisma-template/kokkiri.db ]; then
  echo "=> [KOKKIRI] Initializing /app/prisma/kokkiri.db from template database..."
  cp -f /app/prisma-template/kokkiri.db /app/prisma/kokkiri.db
fi

# 3. Ensure proper file ownership and drop root privileges securely
if [ "$(id -u)" = "0" ]; then
  chown -R nextjs:nodejs /app/data /app/prisma /app/public/uploads 2>/dev/null || true
  echo "=> [KOKKIRI] Launching application as nextjs on port ${PORT:-3000}..."
  exec su-exec nextjs "$@"
else
  echo "=> [KOKKIRI] Launching application on port ${PORT:-3000}..."
  exec "$@"
fi
