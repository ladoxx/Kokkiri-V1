#!/bin/sh
set -e

# Ensure runtime directories exist
mkdir -p /app/data /app/prisma /app/public/uploads

# 1. If /app/data is empty (e.g., fresh Coolify volume mount), initialize default JSON configs
if [ ! -f /app/data/company-info.json ] && [ -d /app/data-template ]; then
  echo "=> [KOKKIRI] Initializing /app/data from template..."
  cp -rn /app/data-template/* /app/data/ 2>/dev/null || cp -r /app/data-template/* /app/data/ || true
fi

# 2. If /app/prisma is missing, empty or uninitialized kokkiri.db, copy from template
DB_SIZE=$(wc -c < /app/prisma/kokkiri.db 2>/dev/null || echo 0)
if [ ! -f /app/prisma/kokkiri.db ] || [ "$DB_SIZE" -lt 5000 ]; then
  if [ -f /app/prisma-template/kokkiri.db ]; then
    echo "=> [KOKKIRI] Initializing /app/prisma/kokkiri.db from template (previous size: $DB_SIZE bytes)..."
    cp -f /app/prisma-template/kokkiri.db /app/prisma/kokkiri.db
  fi
fi

# 3. Ensure proper ownership for nextjs user on persistent volumes
chown -R nextjs:nodejs /app/data /app/prisma /app/public/uploads 2>/dev/null || true

echo "=> [KOKKIRI] Launching application on port ${PORT:-3000}..."
exec su-exec nextjs "$@"
