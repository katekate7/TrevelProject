#!/bin/bash
# Security checking script for TrevelProject
# This script performs basic security checks on the application
# Run this periodically to ensure security measures are in place

echo "🔒 TrevelProject Security Check Script"
echo "======================================"

# ANSI colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Current directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${BLUE}Project root:${NC} $PROJECT_ROOT"
echo

# Check 1: Environment files
echo -e "${BLUE}[1] Checking environment files for secrets exposure${NC}"
if [ -f "${PROJECT_ROOT}/backend/.env" ]; then
    echo "  ✅ .env file exists"
    if grep -q "APP_ENV=prod" "${PROJECT_ROOT}/backend/.env"; then
        echo -e "  ${YELLOW}⚠️ Warning: APP_ENV=prod in .env file. Environment variables should be set on the server instead.${NC}"
    else
        echo "  ✅ No production environment detected in .env file"
    fi
    
    if grep -q "APP_DEBUG=true" "${PROJECT_ROOT}/backend/.env"; then
        echo -e "  ${RED}❌ Error: APP_DEBUG is set to true which should never be the case in production${NC}"
    fi
else
    echo -e "  ${RED}❌ Error: .env file not found${NC}"
fi
echo

# Check 2: JWT keys
echo -e "${BLUE}[2] Checking JWT configuration${NC}"
if [ -f "${PROJECT_ROOT}/backend/config/jwt/private.pem" ]; then
    echo "  ✅ Private key exists"
    # Check permissions
    if [[ $(stat -f "%A" "${PROJECT_ROOT}/backend/config/jwt/private.pem") == "600" ]]; then
        echo "  ✅ Private key has correct permissions"
    else
        echo -e "  ${RED}❌ Error: Private key has incorrect permissions. Should be 600.${NC}"
    fi
else
    echo -e "  ${RED}❌ Error: JWT private key not found${NC}"
fi
echo

# Check 3: Security headers
echo -e "${BLUE}[3] Checking security headers configuration${NC}"
if [ -f "${PROJECT_ROOT}/backend/src/EventListener/SecurityHeadersListener.php" ]; then
    echo "  ✅ Security headers listener found"
else
    echo -e "  ${RED}❌ Error: Security headers configuration not found${NC}"
fi
echo

# Check 4: CORS configuration
echo -e "${BLUE}[4] Checking CORS configuration${NC}"
if [ -f "${PROJECT_ROOT}/backend/config/packages/nelmio_cors.yaml" ]; then
    echo "  ✅ CORS configuration found"
    if grep -q "allow_origin: '\*'" "${PROJECT_ROOT}/backend/config/packages/nelmio_cors.yaml"; then
        echo -e "  ${RED}❌ Error: CORS allows all origins (*) which is a security risk${NC}"
    else
        echo "  ✅ No wildcard CORS origin detected"
    fi
else
    echo -e "  ${RED}❌ Error: CORS configuration not found${NC}"
fi
echo

# Check 5: Check dependencies for security vulnerabilities
echo -e "${BLUE}[5] Checking for vulnerable dependencies${NC}"
echo "  ⚙️ Running Symfony security:check..."
cd "${PROJECT_ROOT}/backend" && symfony security:check 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "  ${YELLOW}⚠️ Warning: Could not run security:check. Make sure Symfony CLI is installed.${NC}"
    echo "  💡 Install with: curl -sS https://get.symfony.com/cli/installer | bash"
    echo "  🔍 Or check manually: https://security.symfony.com/check_lock"
fi
echo

# Check 6: Check frontend dependencies
echo -e "${BLUE}[6] Checking frontend dependencies${NC}"
if [ -f "${PROJECT_ROOT}/Frontend/package.json" ]; then
    echo "  ✅ Frontend package.json found"
    echo "  ⚙️ Consider running 'npm audit' regularly to check for vulnerabilities"
else
    echo -e "  ${RED}❌ Error: Frontend package.json not found${NC}"
fi
echo

# Check 7: Recommendations
echo -e "${BLUE}[7] Additional security recommendations${NC}"
echo "  • Regularly update all dependencies"
echo "  • Implement a Content Security Policy"
echo "  • Use HTTPS in production"
echo "  • Implement rate limiting for all endpoints"
echo "  • Monitor logs for suspicious activity"
echo "  • Consider using an automated security scanning service"
echo

echo -e "${GREEN}Security check completed!${NC}"
echo "Review any warnings or errors above and address them to improve your application security."
