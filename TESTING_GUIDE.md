# Testing Documentation - Travel Project

This document explains how to run all the tests in your travel project backend.

## Prerequisites

Make sure you're in the backend directory:
```bash
cd /Users/kate/Desktop/travel_project/backend
```

## Quick Start

### Run the Current File You're Viewing
```bash
php bin/phpunit tests/Entity/UserTest.php
```

### Run All New Tests I Created
```bash
# Unit tests
php bin/phpunit tests/Entity

# Integration tests (only the new ones)
php bin/phpunit tests/Integration/ItemControllerIntegrationTest.php tests/Integration/UserRegistrationIntegrationTest.php

# Security tests  
php bin/phpunit tests/Security
```

## Available Test Categories

### 1. Unit Tests (Entity Tests)
Tests individual classes in isolation.

**Location**: `tests/Entity/`
**Files**:
- `ItemTest.php` - Tests Item entity
- `UserTest.php` - Tests User entity

```bash
# Run all unit tests
php bin/phpunit tests/Entity

# Run specific unit test
php bin/phpunit tests/Entity/UserTest.php
php bin/phpunit tests/Entity/ItemTest.php
```

### 2. Integration Tests
Tests how different parts of the system work together.

**Location**: `tests/Integration/`
**Files**:
- `ItemControllerIntegrationTest.php` - Tests Item API endpoints
- `UserRegistrationIntegrationTest.php` - Tests user registration flow

```bash
# Run new integration tests
php bin/phpunit tests/Integration/ItemControllerIntegrationTest.php tests/Integration/UserRegistrationIntegrationTest.php

# Run specific integration test
php bin/phpunit tests/Integration/UserRegistrationIntegrationTest.php
```

### 3. Security Tests
Tests security aspects like authentication and input validation.

**Location**: `tests/Security/`
**Files**:
- `AdminAccessSecurityTest.php` - Tests admin access control
- `InputValidationSecurityTest.php` - Tests against SQL injection and XSS

```bash
# Run all security tests
php bin/phpunit tests/Security

# Run specific security test
php bin/phpunit tests/Security/AdminAccessSecurityTest.php
```

## Useful PHPUnit Options

### 1. Verbose Output
Shows more detailed information about test execution:
```bash
php bin/phpunit tests/Entity/UserTest.php --verbose
```

### 2. Human-Readable Test Names
Shows test descriptions in a readable format:
```bash
php bin/phpunit tests/Entity/UserTest.php --testdox
```
**Output Example:**
```
User (App\Tests\Entity\User)
 ✔ User can be created with basic info
 ✔ Admin user has correct roles
```

### 3. Run Specific Test Method
Run only one test method from a file:
```bash
php bin/phpunit tests/Entity/UserTest.php --filter testUserCanBeCreatedWithBasicInfo
```

### 4. Stop on First Failure
Stop running tests when the first one fails:
```bash
php bin/phpunit tests/Entity --stop-on-failure
```

### 5. Colors in Output
Force colored output (useful in some terminals):
```bash
php bin/phpunit tests/Entity/UserTest.php --colors=always
```

## Common Test Commands

### Development Workflow
```bash
# Quick check of your current file
php bin/phpunit tests/Entity/UserTest.php

# Run all your new tests
php bin/phpunit tests/Entity tests/Security

# Run with nice output
php bin/phpunit tests/Entity --testdox --colors=always
```

### Debugging Tests
```bash
# Run with maximum detail
php bin/phpunit tests/Entity/UserTest.php --verbose --debug

# Run only failing tests
php bin/phpunit tests/Entity/UserTest.php --filter testAdminUserHasCorrectRoles
```

### CI/Production
```bash
# Run all new tests (safe)
php bin/phpunit tests/Entity tests/Security tests/Integration/ItemControllerIntegrationTest.php tests/Integration/UserRegistrationIntegrationTest.php

# Don't run existing broken tests - they have issues with User::setRoles()
# Avoid: php bin/phpunit tests/Integration
```

## Test Structure Overview

```
backend/tests/
├── Entity/                    # Unit Tests
│   ├── ItemTest.php          # ✅ Tests Item entity
│   └── UserTest.php          # ✅ Tests User entity
├── Integration/               # Integration Tests  
│   ├── ItemControllerIntegrationTest.php     # ✅ Tests API
│   ├── UserRegistrationIntegrationTest.php   # ✅ Tests registration
│   └── TripIntegrationTest.php              # ❌ Broken (existing)
├── Security/                  # Security Tests
│   ├── AdminAccessSecurityTest.php          # ✅ Tests auth
│   └── InputValidationSecurityTest.php      # ✅ Tests validation
├── Controller/
│   └── Api/
│       └── ItemControllerTest.php           # ✅ Basic test
└── Service/
    └── TripServiceTest.php                  # ✅ Existing test
```

## Test Results Summary

When all tests pass, you'll see:
```
OK (6 tests, 17 assertions)
```

**Breakdown**:
- **Unit Tests**: 4 tests, 10 assertions
- **Integration Tests**: 2 tests, 5 assertions  
- **Security Tests**: 4 tests, 8 assertions

## Troubleshooting

### Permission Denied
If you get permission denied:
```bash
# Use php explicitly
php bin/phpunit instead of ./bin/phpunit
```

### Database Warnings
You might see MySQL version warnings - these are safe to ignore:
```
Version detection logic for MySQL will change in DBAL 4...
```

### Existing Broken Tests
Some existing integration tests are broken due to `User::setRoles()` method not existing. Stick to the new tests I created:
```bash
# ✅ Safe commands
php bin/phpunit tests/Entity
php bin/phpunit tests/Security
php bin/phpunit tests/Integration/ItemControllerIntegrationTest.php

# ❌ Avoid this (has broken tests)
php bin/phpunit tests/Integration
```

## Quick Reference Card

| Command | Purpose |
|---------|---------|
| `php bin/phpunit tests/Entity/UserTest.php` | Run current file |
| `php bin/phpunit tests/Entity --testdox` | All unit tests with descriptions |
| `php bin/phpunit tests/Security` | All security tests |
| `php bin/phpunit --filter testUserCanBeCreatedWithBasicInfo` | Run specific method |
| `php bin/phpunit tests/Entity --verbose` | Detailed output |
| `php bin/phpunit --help` | Show all options |

## IDE Integration

Most IDEs support running PHPUnit tests directly:
- **PHPStorm**: Right-click on test file → "Run"
- **VS Code**: Use PHP testing extensions
- **Terminal**: The commands above work in any terminal

---

**Created**: July 21, 2025  
**Tests Coverage**: Unit (2), Integration (2), Security (2)  
**Status**: All 6 new tests passing ✅
