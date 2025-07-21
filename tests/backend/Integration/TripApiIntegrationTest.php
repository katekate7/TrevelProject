<?php

namespace App\Tests\Integration;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;

class TripApiIntegrationTest extends WebTestCase
{
    private $client;
    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = self::getContainer()->get('doctrine')->getManager();
    }

    public function testCreateTripApiEndpoint(): void
    {
        // Create and authenticate user
        $user = $this->createAuthenticatedUser();
        
        $tripData = [
            'country' => 'France',
            'city' => 'Paris',
            'startDate' => '2025-08-01',
            'endDate' => '2025-08-10'
        ];

        $this->client->request(
            'POST',
            '/api/trips/add',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($tripData)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('id', $responseData);
        $this->assertIsInt($responseData['id']);
    }

    public function testGetTripsList(): void
    {
        $user = $this->createAuthenticatedUser();
        
        // Create some trips first
        $this->createTestTrip($user, 'Paris', 'France', '2025-08-01', '2025-08-10');
        $this->createTestTrip($user, 'London', 'UK', '2025-09-01', '2025-09-10');

        $this->client->request('GET', '/api/trips');
        
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        
        $trips = json_decode($response->getContent(), true);
        $this->assertIsArray($trips);
        $this->assertCount(2, $trips);
        
        // Verify trip structure
        $this->assertArrayHasKey('id', $trips[0]);
        $this->assertArrayHasKey('city', $trips[0]);
        $this->assertArrayHasKey('country', $trips[0]);
        $this->assertArrayHasKey('startDate', $trips[0]);
        $this->assertArrayHasKey('endDate', $trips[0]);
    }

    public function testGetSingleTrip(): void
    {
        $user = $this->createAuthenticatedUser();
        $trip = $this->createTestTrip($user, 'Rome', 'Italy', '2025-10-01', '2025-10-10');

        $this->client->request('GET', "/api/trips/{$trip->getId()}");
        
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        
        $tripData = json_decode($response->getContent(), true);
        $this->assertEquals('Rome', $tripData['city']);
        $this->assertEquals('Italy', $tripData['country']);
        $this->assertEquals('2025-10-01', $tripData['startDate']);
        $this->assertEquals('2025-10-10', $tripData['endDate']);
    }

    public function testUpdateTrip(): void
    {
        $user = $this->createAuthenticatedUser();
        $trip = $this->createTestTrip($user, 'Berlin', 'Germany', '2025-08-01', '2025-08-10');

        $updateData = [
            'startDate' => '2025-08-05',
            'endDate' => '2025-08-15'
        ];

        $this->client->request(
            'PATCH',
            "/api/trips/{$trip->getId()}",
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($updateData)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('2025-08-05', $responseData['startDate']);
        $this->assertEquals('2025-08-15', $responseData['endDate']);
    }

    public function testDeleteTrip(): void
    {
        $user = $this->createAuthenticatedUser();
        $trip = $this->createTestTrip($user, 'Madrid', 'Spain', '2025-08-01', '2025-08-10');

        $this->client->request('DELETE', "/api/trips/{$trip->getId()}");
        
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_NO_CONTENT, $response->getStatusCode());

        // Verify trip is deleted
        $this->client->request('GET', "/api/trips/{$trip->getId()}");
        $this->assertEquals(Response::HTTP_NOT_FOUND, $this->client->getResponse()->getStatusCode());
    }

    public function testUnauthorizedAccess(): void
    {
        // Test without authentication
        $this->client->request('GET', '/api/trips');
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());

        // Test POST without authentication
        $tripData = [
            'country' => 'France',
            'city' => 'Paris',
            'startDate' => '2025-08-01',
            'endDate' => '2025-08-10'
        ];

        $this->client->request(
            'POST',
            '/api/trips/add',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($tripData)
        );

        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }

    public function testInvalidTripData(): void
    {
        $user = $this->createAuthenticatedUser();
        
        // Test with missing required fields
        $invalidData = [
            'city' => 'Paris',
            // Missing country, startDate, endDate
        ];

        $this->client->request(
            'POST',
            '/api/trips/add',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($invalidData)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function testAccessOtherUserTrip(): void
    {
        // Create two users
        $user1 = $this->createAuthenticatedUser('user1@example.com', 'user1');
        $user2 = $this->createUser('user2@example.com', 'user2');
        
        // Create trip for user2
        $trip = $this->createTestTrip($user2, 'Tokyo', 'Japan', '2025-08-01', '2025-08-10');

        // Try to access user2's trip while authenticated as user1
        $this->client->request('GET', "/api/trips/{$trip->getId()}");
        
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response->getStatusCode());
    }

    private function createUser(string $email = 'test@example.com', string $username = 'testuser'): User
    {
        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username);
        $user->setPassword('$2y$13$hashedpassword'); // Hashed password
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $user;
    }

    private function createAuthenticatedUser(string $email = 'test@example.com', string $username = 'testuser'): User
    {
        $user = $this->createUser($email, $username);
        
        // Simulate authentication by logging in the user
        $this->client->loginUser($user);
        
        return $user;
    }

    private function createTestTrip(User $user, string $city, string $country, string $startDate, string $endDate)
    {
        $trip = new \App\Entity\Trip();
        $trip->setUser($user)
             ->setCity($city)
             ->setCountry($country)
             ->setStartDate(new \DateTimeImmutable($startDate))
             ->setEndDate(new \DateTimeImmutable($endDate));

        $this->entityManager->persist($trip);
        $this->entityManager->flush();

        return $trip;
    }

    protected function tearDown(): void
    {
        // Clean up database
        $this->entityManager->createQuery('DELETE FROM App\Entity\Trip')->execute();
        $this->entityManager->createQuery('DELETE FROM App\Entity\User')->execute();
        
        parent::tearDown();
        $this->entityManager->close();
        $this->entityManager = null;
    }
}
