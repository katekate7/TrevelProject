<?php

namespace App\Tests\Service;

use App\Service\TripService;
use App\Service\WeatherService;
use App\Entity\Trip;
use App\Entity\User;
use App\Repository\TripRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class TripServiceTest extends TestCase
{
    private TripService $tripService;
    private MockObject|TripRepository $tripRepository;
    private MockObject|EntityManagerInterface $entityManager;
    private MockObject|WeatherService $weatherService;

    protected function setUp(): void
    {
        $this->tripRepository = $this->createMock(TripRepository::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->weatherService = $this->createMock(WeatherService::class);
        
        $this->tripService = new TripService(
            $this->tripRepository,
            $this->entityManager,
            $this->weatherService
        );
    }

    public function testCreateTripWithValidData(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');
        
        $tripData = [
            'city' => 'Paris',
            'country' => 'France',
            'startDate' => '2025-08-01',
            'endDate' => '2025-08-10'
        ];

        // Mock expectations
        $this->entityManager->expects($this->once())
            ->method('persist')
            ->with($this->callback(function (Trip $trip) {
                return $trip->getCity() === 'Paris' 
                    && $trip->getCountry() === 'France'
                    && $trip->getStartDate()->format('Y-m-d') === '2025-08-01'
                    && $trip->getEndDate()->format('Y-m-d') === '2025-08-10';
            }));

        $this->entityManager->expects($this->once())->method('flush');
        
        $this->weatherService->expects($this->once())
            ->method('updateWeatherForTrip')
            ->with($this->isInstanceOf(Trip::class));

        // Act
        $result = $this->tripService->createTrip($user, $tripData);

        // Assert
        $this->assertInstanceOf(Trip::class, $result);
        $this->assertEquals('Paris', $result->getCity());
        $this->assertEquals('France', $result->getCountry());
        $this->assertEquals($user, $result->getUser());
        $this->assertEquals('2025-08-01', $result->getStartDate()->format('Y-m-d'));
        $this->assertEquals('2025-08-10', $result->getEndDate()->format('Y-m-d'));
    }

    public function testCreateTripWithInvalidStartDate(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');
        
        $invalidTripData = [
            'city' => 'Paris',
            'country' => 'France',
            'startDate' => 'invalid-date',
            'endDate' => '2025-08-10'
        ];

        // Assert
        $this->expectException(\Exception::class);

        // Act
        $this->tripService->createTrip($user, $invalidTripData);
    }

    public function testUpdateTripWithValidData(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');
        
        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('Paris')
             ->setCountry('France')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $updateData = [
            'startDate' => '2025-08-05',
            'endDate' => '2025-08-15'
        ];

        // Mock expectations
        $this->entityManager->expects($this->once())->method('flush');

        // Act
        $result = $this->tripService->updateTrip($trip, $updateData);

        // Assert
        $this->assertEquals('2025-08-05', $result->getStartDate()->format('Y-m-d'));
        $this->assertEquals('2025-08-15', $result->getEndDate()->format('Y-m-d'));
        $this->assertEquals('Paris', $result->getCity());
        $this->assertEquals('France', $result->getCountry());
    }

    /**
     * @dataProvider tripDataProvider
     */
    public function testCreateTripWithVariousInputs(
        array $tripData,
        bool $shouldSucceed
    ): void {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');

        if (!$shouldSucceed) {
            $this->expectException(\Exception::class);
        } else {
            $this->entityManager->expects($this->once())->method('persist');
            $this->entityManager->expects($this->once())->method('flush');
            $this->weatherService->expects($this->once())->method('updateWeatherForTrip');
        }

        // Act
        $result = $this->tripService->createTrip($user, $tripData);

        // Assert
        if ($shouldSucceed) {
            $this->assertInstanceOf(Trip::class, $result);
        }
    }

    public static function tripDataProvider(): array
    {
        return [
            'valid Paris trip' => [
                ['city' => 'Paris', 'country' => 'France', 'startDate' => '2025-08-01', 'endDate' => '2025-08-10'],
                true
            ],
            'valid London trip' => [
                ['city' => 'London', 'country' => 'United Kingdom', 'startDate' => '2025-09-15', 'endDate' => '2025-09-20'],
                true
            ],
            'invalid start date' => [
                ['city' => 'Paris', 'country' => 'France', 'startDate' => 'invalid', 'endDate' => '2025-08-10'],
                false
            ],
            'invalid end date' => [
                ['city' => 'Berlin', 'country' => 'Germany', 'startDate' => '2025-08-01', 'endDate' => 'bad-date'],
                false
            ],
            'empty city' => [
                ['city' => '', 'country' => 'France', 'startDate' => '2025-08-01', 'endDate' => '2025-08-10'],
                false
            ],
            'missing country' => [
                ['city' => 'Paris', 'startDate' => '2025-08-01', 'endDate' => '2025-08-10'],
                false
            ],
            'end date before start date' => [
                ['city' => 'Rome', 'country' => 'Italy', 'startDate' => '2025-08-15', 'endDate' => '2025-08-10'],
                false
            ],
        ];
    }

    public function testDeleteTrip(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');
        
        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('Paris')
             ->setCountry('France')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $this->tripRepository->expects($this->once())
            ->method('find')
            ->with(1)
            ->willReturn($trip);

        $this->entityManager->expects($this->once())
            ->method('remove')
            ->with($trip);

        $this->entityManager->expects($this->once())
            ->method('flush');

        // Act
        $result = $this->tripService->deleteTrip(1, $user);

        // Assert
        $this->assertTrue($result);
    }

    public function testDeleteTripNotFound(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');

        $this->tripRepository->expects($this->once())
            ->method('find')
            ->with(999)
            ->willReturn(null);

        $this->entityManager->expects($this->never())->method('remove');

        // Act & Assert
        $this->expectException(\InvalidArgumentException::class);
        $this->tripService->deleteTrip(999, $user);
    }

    public function testUpdateTripWithInvalidData(): void
    {
        // Arrange
        $user = new User();
        $user->setEmail('test@example.com');
        
        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('Paris')
             ->setCountry('France')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $invalidUpdateData = [
            'startDate' => 'invalid-date',
            'endDate' => '2025-08-15'
        ];

        // Act & Assert
        $this->expectException(\Exception::class);
        $this->tripService->updateTrip($trip, $invalidUpdateData);
    }
}