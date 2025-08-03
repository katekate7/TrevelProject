#!/bin/bash

# Database import script for Travel Project
# Make sure your MySQL server is running on port 8889 before running this script

echo "🚀 Setting up Travel Project Database..."

# Check if MySQL is accessible
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
    
    # Create database if it doesn't exist
    echo "📝 Creating database travel_db..."
    mysql -h 127.0.0.1 -P 8889 -u root -proot -e "CREATE DATABASE IF NOT EXISTS travel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    
    # Import the database dump
    echo "📦 Importing database structure and data..."
    mysql -h 127.0.0.1 -P 8889 -u root -proot travel_db < travel_db.sql
    
    echo "✅ Database setup complete!"
    echo ""
    echo "🔄 Running Symfony migrations..."
    cd backend
    php bin/console doctrine:migrations:migrate --no-interaction
    
    echo ""
    echo "🎉 Setup complete! Your database is ready."
    echo ""
    echo "To start the project:"
    echo "  Backend: cd backend && php -S localhost:8000 -t public"
    echo "  Frontend: cd frontend_new && npm run dev"
    
else
    echo "❌ Cannot connect to MySQL server"
    echo "Please make sure:"
    echo "  1. MAMP/XAMPP is running"
    echo "  2. MySQL is running on port 8889"
    echo "  3. Username: root, Password: root"
    echo ""
    echo "Alternative: You can manually import the database:"
    echo "  mysql -h 127.0.0.1 -P 8889 -u root -proot -e 'CREATE DATABASE travel_db;'"
    echo "  mysql -h 127.0.0.1 -P 8889 -u root -proot travel_db < travel_db.sql"
fi
