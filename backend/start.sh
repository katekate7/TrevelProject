#!/bin/bash
set -e

echo "=== Docker Deployment Start ==="

# Go to Symfony project directory
cd /var/www || exit 1
echo "✅ Current working directory: $(pwd)"

echo "PHP version: $(php -v | head -n 1)"

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php bin/console doctrine:database:create --if-not-exists --env=prod --no-interaction 2>/dev/null; do
  echo "Database not ready, waiting..."
  sleep 2
done

# Run database migrations
echo "�️ Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --env=prod || echo "⚠️ Migration failed or no migrations to run"

# Permissions and Symfony setup
mkdir -p var/cache var/log
chmod -R 777 var/

echo "🧹 Clearing Symfony cache..."
php bin/console cache:clear --env=prod --no-debug || echo "⚠️ Failed to clear cache"

# Final check
if [ ! -f "public/index.php" ]; then
  echo "❌ public/index.php not found! Deployment failed."
  exit 1
fi

echo "🚀 Starting Apache server..."
apache2-foreground
