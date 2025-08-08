#!/bin/bash

# City Controller Test Suite Runner
# This script runs all tests for the CityController functionality

echo "🧪 Running City Controller Test Suite"
echo "======================================"

cd "$(dirname "$0")"

echo ""
echo "1️⃣ Running Unit Tests..."
echo "------------------------"
./vendor/bin/phpunit tests/Controller/Api/CityControllerTest.php --colors=always

echo ""
echo "2️⃣ Running Integration Tests..."
echo "-------------------------------"
./vendor/bin/phpunit tests/Integration/CityControllerIntegrationTest.php --colors=always

echo ""
echo "3️⃣ Running System Tests (optional - requires network)..."
echo "---------------------------------------------------------"
echo "⚠️  System tests require network access and may be slow"
read -p "Run system tests? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./vendor/bin/phpunit tests/System/CitySystemTest.php --colors=always
else
    echo "Skipping system tests"
fi

echo ""
echo "✅ Test suite complete!"
echo ""
echo "To run specific test types:"
echo "- Unit tests only:        ./vendor/bin/phpunit tests/Controller/Api/CityControllerTest.php"
echo "- Integration tests only: ./vendor/bin/phpunit tests/Integration/CityControllerIntegrationTest.php"
echo "- System tests only:      ./vendor/bin/phpunit tests/System/CitySystemTest.php"
echo "- All city tests:         ./vendor/bin/phpunit --filter CityController"
