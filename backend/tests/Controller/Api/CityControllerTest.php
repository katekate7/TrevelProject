<?php
/**
 * Unit test suite for CityController API endpoints.
 * 
 * This test class validates the CityController's core functionality including:
 * - City search query validation
 * - Response formatting and structure
 * - HTTP client integration
 * - Empty query handling
 * 
 * Uses WebTestCase with mocked HTTP client for testing.
 * 
 * @package App\Tests\Controller\Api
 * @author Travel Project Team
 */

namespace App\Tests\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

/**
 * Unit tests for CityController functionality.
 * 
 * Tests controller logic with mocked HTTP client
 * to ensure proper behavior and response formatting.
 */
final class CityControllerTest extends WebTestCase
{
    private $client;
    private HttpClientInterface $httpClient;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->httpClient = $this->createMock(HttpClientInterface::class);
    }

    /**
     * Test successful city search with valid query.
     */
    public function testSearchWithValidQuery(): void
    {
        // Arrange
        $mockResponse = $this->createMock(ResponseInterface::class);
        
        $mockApiData = [
            [
                'display_name' => 'Paris, France',
                'address' => [
                    'city' => 'Paris',
                    'country' => 'France'
                ]
            ]
        ];
        
        $mockResponse->method('toArray')->willReturn($mockApiData);
        $this->httpClient->method('request')->willReturn($mockResponse);
        
        // Replace the HTTP client service
        $this->client->getContainer()->set(HttpClientInterface::class, $this->httpClient);

        // Act
        $this->client->request('GET', '/api/cities?q=Paris');

        // Assert
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertCount(1, $responseData);
        $this->assertEquals('Paris, France', $responseData[0]['label']);
        $this->assertEquals('Paris', $responseData[0]['city']);
        $this->assertEquals('France', $responseData[0]['country']);
    }

    /**
     * Test search with empty query returns empty array.
     */
    public function testSearchWithEmptyQuery(): void
    {
        // Act
        $this->client->request('GET', '/api/cities');

        // Assert
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertEmpty($responseData);
    }

    /**
     * Test search with missing address fields uses fallbacks.
     */
    public function testSearchWithMissingAddressFields(): void
    {
        // Arrange
        $mockResponse = $this->createMock(ResponseInterface::class);
        
        $mockApiData = [
            [
                'display_name' => 'Small Village, Country',
                'address' => [
                    'village' => 'Small Village', // No city/town, should fallback to village
                    'country' => 'Country'
                ]
            ]
        ];
        
        $mockResponse->method('toArray')->willReturn($mockApiData);
        $this->httpClient->method('request')->willReturn($mockResponse);
        $this->client->getContainer()->set(HttpClientInterface::class, $this->httpClient);

        // Act
        $this->client->request('GET', '/api/cities?q=Village');

        // Assert
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Small Village', $responseData[0]['city']);
    }

    /**
     * Test search verifies correct API parameters are sent.
     */
    public function testSearchSendsCorrectApiParameters(): void
    {
        // Arrange
        $mockResponse = $this->createMock(ResponseInterface::class);
        $mockResponse->method('toArray')->willReturn([]);

        // Assert API call parameters
        $this->httpClient->expects($this->once())
            ->method('request')
            ->with(
                'GET',
                'https://nominatim.openstreetmap.org/search',
                $this->callback(function ($options) {
                    return $options['query']['q'] === 'London' &&
                           $options['query']['format'] === 'json' &&
                           $options['query']['addressdetails'] === 1 &&
                           $options['query']['limit'] === 5 &&
                           $options['headers']['User-Agent'] === 'MyTravelApp/1.0 (email)';
                })
            )
            ->willReturn($mockResponse);
            
        $this->client->getContainer()->set(HttpClientInterface::class, $this->httpClient);

        // Act
        $this->client->request('GET', '/api/cities?q=London');
    }
}
