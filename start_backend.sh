#!/bin/bash

# Start Backend Server
echo "🚀 Starting Symfony Backend Server..."
echo "Backend will be available at: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""

cd backend
php -S localhost:8000 -t public
