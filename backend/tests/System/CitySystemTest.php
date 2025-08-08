<?php
/**
 * System test suite for CityController end-to-end functionality.
 * 
 * This test class validates the complete system behavior including:
 * - Real external API integration (can be disabled in CI)
 * - Full request/response cycle
 * - Network connectivity and error handling
 * - Real-world data validation
 * 
 * Uses WebTestCase for complete system testing.
 * Note: These tests may require network access and can be slow.
 * 
 * @package App\Tests\System
 * @author Travel Project Team
 */

namespace App\Tests\System;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * System tests for CityController complete functionality.
 * 
 * Tests the entire system including external API calls
 * to ensure end-to-end functionality works correctly.
 */
final class CitySystemTest extends WebTestCase
{
    /**
     * Test complete city search functionality with real API.
     * 
     * @group system
     * @group slow
     */
    public function testCompleteCitySearchSystemFlow(): void
    {
        // Skip if no network access (e.g., in CI without external API access)
        if (!$this->hasNetworkAccess()) {
            $this->markTestSkipped('Network access required for system tests');
        }

        // Arrange
        $client = static::createClient();

        // Act - Search for a well-known city
        $client->request('GET', '/api/cities?q=London');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertJson($response->getContent());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        
        if (!empty($responseData)) {
            // Verify response structure
            $firstResult = $responseData[0];
            $this->assertArrayHasKey('label', $firstResult);
            $this->assertArrayHasKey('city', $firstResult);
            $this->assertArrayHasKey('country', $firstResult);
            
            // Verify data types
            $this->assertIsString($firstResult['label']);
            $this->assertIsString($firstResult['city']);
            $this->assertIsString($firstResult['country']);
            
            // Basic data validation for London search
            $this->assertStringContainsStringIgnoringCase('london', $firstResult['label']);
        }
    }

    /**
     * Test system behavior with non-existent city query.
     * 
     * @group system
     */
    public function testCitySearchWithNonExistentCity(): void
    {
        if (!$this->hasNetworkAccess()) {
            $this->markTestSkipped('Network access required for system tests');
        }

        // Arrange
        $client = static::createClient();

        // Act - Search for a non-existent city
        $client->request('GET', '/api/cities?q=NonExistentCityXYZ123');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        // Should return empty array or minimal results for non-existent city
    }

    /**
     * Test system performance with city search.
     * 
     * @group system
     * @group performance
     */
    public function testCitySearchPerformance(): void
    {
        if (!$this->hasNetworkAccess()) {
            $this->markTestSkipped('Network access required for system tests');
        }

        // Arrange
        $client = static::createClient();
        $startTime = microtime(true);

        // Act
        $client->request('GET', '/api/cities?q=Paris');

        // Assert
        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        
        // Assert reasonable response time (under 5 seconds for external API)
        $this->assertLessThan(5000, $responseTime, 'API response should be under 5 seconds');
    }

    /**
     * Test system with multiple rapid requests (rate limiting behavior).
     * 
     * @group system
     */
    public function testMultipleRapidCitySearchRequests(): void
    {
        if (!$this->hasNetworkAccess()) {
            $this->markTestSkipped('Network access required for system tests');
        }

        // Arrange
        $client = static::createClient();
        $queries = ['Berlin', 'Tokyo', 'New York'];

        // Act & Assert
        foreach ($queries as $query) {
            $client->request('GET', "/api/cities?q={$query}");
            $response = $client->getResponse();
            
            // Should handle multiple requests gracefully
            $this->assertContains(
                $response->getStatusCode(), 
                [Response::HTTP_OK, Response::HTTP_TOO_MANY_REQUESTS],
                'Should either succeed or properly handle rate limiting'
            );
            
            // Small delay to be respectful to external API
            usleep(500000); // 0.5 seconds
        }
    }

    /**
     * Check if network access is available for system tests.
     */
    private function hasNetworkAccess(): bool
    {
        // Check if we can reach the Nominatim API
        $context = stream_context_create([
            'http' => [
                'timeout' => 3,
                'method' => 'HEAD'
            ]
        ]);
        
        $result = @file_get_contents(
            'https://nominatim.openstreetmap.org/search?q=test&format=json&limit=1',
            false,
            $context
        );
        
        return $result !== false;
    }
}
