# City Controller Test Suite Documentation

## Overview
This document describes the comprehensive test suite for the CityController's city search functionality. The tests are organized into three levels following the test pyramid:

1. **Unit Tests** - Fast, isolated tests with mocked dependencies
2. **Integration Tests** - Medium-speed tests with real HTTP routing but mocked external services  
3. **System Tests** - Slow, end-to-end tests with real external API calls

## Test Files

### 1. Unit Tests (`tests/Controller/Api/CityControllerTest.php`)
**Purpose**: Test controller logic in isolation with mocked HTTP client

**Test Cases**:
- ✅ `testSearchWithValidQuery()` - Validates successful city search with proper response formatting
- ✅ `testSearchWithEmptyQuery()` - Ensures empty query returns empty array
- ✅ `testSearchWithMissingAddressFields()` - Tests fallback hierarchy (city → town → village)
- ✅ `testSearchSendsCorrectApiParameters()` - Verifies correct API parameters are sent to Nominatim

**Key Features**:
- Uses mocked HttpClientInterface
- Tests response structure and data transformation
- Validates API parameter construction
- Fast execution (~1 second)

### 2. Integration Tests (`tests/Integration/CityControllerIntegrationTest.php`)  
**Purpose**: Test full HTTP request/response cycle with mocked external services

**Test Cases**:
- ✅ `testCitySearchEndpointWithValidQuery()` - Full HTTP GET request testing
- ✅ `testCitySearchEndpointWithEmptyQuery()` - Empty query parameter handling
- ✅ `testCitySearchEndpointWithSpecialCharacters()` - Unicode/special character support
- ✅ `testCitySearchEndpointResponseHeaders()` - HTTP headers validation  
- ✅ `testCitySearchEndpointMethodNotAllowed()` - HTTP method restrictions

**Key Features**:
- Uses WebTestCase for real HTTP routing
- Mocks external API responses
- Tests route accessibility and HTTP status codes
- Medium execution speed (~0.3 seconds)

### 3. System Tests (`tests/System/CitySystemTest.php`)
**Purpose**: End-to-end testing with real external API calls

**Test Cases**:
- 🔄 `testCompleteCitySearchSystemFlow()` - Complete workflow with real Nominatim API
- 🔄 `testCitySearchWithNonExistentCity()` - Behavior with invalid city names
- 🔄 `testCitySearchPerformance()` - Performance validation (< 5 seconds)
- 🔄 `testMultipleRapidCitySearchRequests()` - Rate limiting behavior

**Key Features**:
- Real external API integration
- Network connectivity detection
- Performance testing
- Graceful degradation (skips if no network)
- Slow execution (network dependent)

## Running Tests

### Individual Test Types
```bash
# Unit tests only (fast)
./vendor/bin/phpunit tests/Controller/Api/CityControllerTest.php

# Integration tests only (medium)  
./vendor/bin/phpunit tests/Integration/CityControllerIntegrationTest.php

# System tests only (slow, requires network)
./vendor/bin/phpunit tests/System/CitySystemTest.php
```

### All City Tests
```bash
# Run all city-related tests
./vendor/bin/phpunit --filter CityController
```

### Using the Test Runner Script
```bash
# Interactive test runner
./run_city_tests.sh
```

## Test Coverage

The test suite covers:

### ✅ **Functional Testing**
- City search with valid queries
- Empty query handling
- Special character support
- Response data formatting
- API parameter validation

### ✅ **HTTP Protocol Testing**  
- GET request handling
- Query parameter parsing
- JSON response formatting
- HTTP status codes
- Method restrictions (POST returns 405)

### ✅ **Integration Testing**
- Route accessibility
- Service dependency injection
- External API integration
- Error handling

### ✅ **Performance Testing**
- Response time validation
- Rate limiting behavior
- Multiple request handling

### ✅ **Data Validation**
- Response structure consistency
- City/country field extraction
- Fallback hierarchy (city → town → village)
- Unicode character handling

## Test Data Examples

### Successful Response Structure
```json
[
  {
    "label": "Paris, France", 
    "city": "Paris",
    "country": "France"
  }
]
```

### API Parameters Validated
- `q`: Search query
- `format`: "json"
- `addressdetails`: 1
- `limit`: 5
- `User-Agent`: "MyTravelApp/1.0 (email)"
- `Accept-Language`: "en"

## Benefits of This Test Suite

1. **Confidence**: Multiple test levels ensure functionality works correctly
2. **Regression Prevention**: Changes can't break existing functionality  
3. **Documentation**: Tests serve as living documentation
4. **Performance Monitoring**: System tests catch performance regressions
5. **Reliability**: Integration tests ensure routing and HTTP handling work
6. **Speed**: Unit tests provide fast feedback during development

## Best Practices Demonstrated

- **Test Pyramid**: More unit tests, fewer integration tests, minimal system tests
- **Mocking**: External dependencies mocked in unit/integration tests
- **Realistic Data**: Tests use realistic city names and API responses
- **Error Scenarios**: Tests cover edge cases and error conditions
- **Performance Awareness**: System tests include performance validation
- **Network Resilience**: System tests gracefully handle network unavailability
