<?php
/**
 * Integration test suite for CityController HTTP endpoints.
 * 
 * This test class validates the CityController's HTTP integration including:
 * - Full HTTP request/response cycle
 * - Route handling and parameter parsing
 * - JSON response formatting
 * - API endpoint accessibility
 * 
 * Uses WebTestCase for full integration testing with mocked external services.
 * 
 * @package App\Tests\Integration
 * @author Travel Project Team
 */

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

/**
 * Integration tests for CityController HTTP endpoints.
 * 
 * Tests the full HTTP request cycle including routing,
 * parameter handling, and response formatting.
 */
final class CityControllerIntegrationTest extends WebTestCase
{
    /**
     * Test successful city search endpoint with valid query.
     */
    public function testCitySearchEndpointWithValidQuery(): void
    {
        // Arrange
        $client = static::createClient();
        
        // Mock the HTTP client service
        $mockHttpClient = $this->createMock(HttpClientInterface::class);
        $mockResponse = $this->createMock(ResponseInterface::class);
        
        $mockApiData = [
            [
                'display_name' => 'Berlin, Germany',
                'address' => [
                    'city' => 'Berlin',
                    'country' => 'Germany'
                ]
            ],
            [
                'display_name' => 'Munich, Bavaria, Germany',
                'address' => [
                    'city' => 'Munich',
                    'country' => 'Germany'
                ]
            ]
        ];
        
        $mockResponse->method('toArray')->willReturn($mockApiData);
        $mockHttpClient->method('request')->willReturn($mockResponse);
        
        // Replace the HTTP client service
        $client->getContainer()->set(HttpClientInterface::class, $mockHttpClient);

        // Act
        $client->request('GET', '/api/cities?q=Berlin');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertJson($response->getContent());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertCount(2, $responseData);
        $this->assertEquals('Berlin', $responseData[0]['city']);
        $this->assertEquals('Germany', $responseData[0]['country']);
    }

    /**
     * Test city search endpoint with empty query parameter.
     */
    public function testCitySearchEndpointWithEmptyQuery(): void
    {
        // Arrange
        $client = static::createClient();

        // Act
        $client->request('GET', '/api/cities');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertJson($response->getContent());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertEmpty($responseData);
    }

    /**
     * Test city search endpoint with special characters in query.
     */
    public function testCitySearchEndpointWithSpecialCharacters(): void
    {
        // Arrange
        $client = static::createClient();
        $mockHttpClient = $this->createMock(HttpClientInterface::class);
        $mockResponse = $this->createMock(ResponseInterface::class);
        
        $mockApiData = [
            [
                'display_name' => 'São Paulo, Brazil',
                'address' => [
                    'city' => 'São Paulo',
                    'country' => 'Brazil'
                ]
            ]
        ];
        
        $mockResponse->method('toArray')->willReturn($mockApiData);
        $mockHttpClient->method('request')->willReturn($mockResponse);
        $client->getContainer()->set(HttpClientInterface::class, $mockHttpClient);

        // Act
        $client->request('GET', '/api/cities?q=São Paulo');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('São Paulo', $responseData[0]['city']);
    }

    /**
     * Test city search endpoint response headers.
     */
    public function testCitySearchEndpointResponseHeaders(): void
    {
        // Arrange
        $client = static::createClient();
        $mockHttpClient = $this->createMock(HttpClientInterface::class);
        $mockResponse = $this->createMock(ResponseInterface::class);
        $mockResponse->method('toArray')->willReturn([]);
        $mockHttpClient->method('request')->willReturn($mockResponse);
        $client->getContainer()->set(HttpClientInterface::class, $mockHttpClient);

        // Act
        $client->request('GET', '/api/cities?q=test');

        // Assert
        $response = $client->getResponse();
        $this->assertTrue($response->headers->contains('Content-Type', 'application/json'));
    }

    /**
     * Test city search endpoint only accepts GET method.
     */
    public function testCitySearchEndpointMethodNotAllowed(): void
    {
        // Arrange
        $client = static::createClient();

        // Act
        $client->request('POST', '/api/cities');

        // Assert
        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_METHOD_NOT_ALLOWED, $response->getStatusCode());
    }
}
