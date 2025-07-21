<?php

namespace App\Tests\Integration;

use App\Entity\Trip;
use App\Entity\User;
use App\Repository\TripRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TripIntegrationTest extends KernelTestCase
{
    private EntityManagerInterface $entityManager;
    private TripRepository $tripRepository;
    private UserRepository $userRepository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->tripRepository = $this->entityManager->getRepository(Trip::class);
        $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    public function testCreateTripWithDatabase(): void
    {
        // Create a test user
        $user = new User();
        $user->setEmail('integration@test.com');
        $user->setUsername('testuser');
        $user->setPassword('hashedpassword');
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Create a trip
        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('Integration Test City')
             ->setCountry('Test Country')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $this->entityManager->persist($trip);
        $this->entityManager->flush();

        // Verify trip was saved
        $savedTrip = $this->tripRepository->find($trip->getId());
        
        $this->assertInstanceOf(Trip::class, $savedTrip);
        $this->assertEquals('Integration Test City', $savedTrip->getCity());
        $this->assertEquals('Test Country', $savedTrip->getCountry());
        $this->assertEquals($user->getId(), $savedTrip->getUser()->getId());
        $this->assertEquals('2025-08-01', $savedTrip->getStartDate()->format('Y-m-d'));
        $this->assertEquals('2025-08-10', $savedTrip->getEndDate()->format('Y-m-d'));
    }

    public function testTripUserRelationship(): void
    {
        // Create user
        $user = new User();
        $user->setEmail('relationship@test.com');
        $user->setUsername('relationuser');
        $user->setPassword('hashedpassword');
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);

        // Create multiple trips for the user
        $trip1 = new Trip();
        $trip1->setUser($user)
              ->setCity('Paris')
              ->setCountry('France')
              ->setStartDate(new \DateTimeImmutable('2025-08-01'))
              ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $trip2 = new Trip();
        $trip2->setUser($user)
              ->setCity('London')
              ->setCountry('UK')
              ->setStartDate(new \DateTimeImmutable('2025-09-01'))
              ->setEndDate(new \DateTimeImmutable('2025-09-10'));

        $this->entityManager->persist($trip1);
        $this->entityManager->persist($trip2);
        $this->entityManager->flush();

        // Test finding trips by user
        $userTrips = $this->tripRepository->findBy(['user' => $user]);
        
        $this->assertCount(2, $userTrips);
        $this->assertEquals('Paris', $userTrips[0]->getCity());
        $this->assertEquals('London', $userTrips[1]->getCity());
    }

    public function testTripUpdate(): void
    {
        // Create user and trip
        $user = new User();
        $user->setEmail('update@test.com');
        $user->setUsername('updateuser');
        $user->setPassword('hashedpassword');
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);

        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('Original City')
             ->setCountry('Original Country')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $this->entityManager->persist($trip);
        $this->entityManager->flush();

        $tripId = $trip->getId();

        // Update the trip
        $trip->setCity('Updated City');
        $trip->setStartDate(new \DateTimeImmutable('2025-08-05'));
        
        $this->entityManager->flush();

        // Verify updates
        $updatedTrip = $this->tripRepository->find($tripId);
        
        $this->assertEquals('Updated City', $updatedTrip->getCity());
        $this->assertEquals('Original Country', $updatedTrip->getCountry()); // Should remain unchanged
        $this->assertEquals('2025-08-05', $updatedTrip->getStartDate()->format('Y-m-d'));
    }

    public function testTripDeletion(): void
    {
        // Create user and trip
        $user = new User();
        $user->setEmail('delete@test.com');
        $user->setUsername('deleteuser');
        $user->setPassword('hashedpassword');
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);

        $trip = new Trip();
        $trip->setUser($user)
             ->setCity('To Be Deleted')
             ->setCountry('Delete Country')
             ->setStartDate(new \DateTimeImmutable('2025-08-01'))
             ->setEndDate(new \DateTimeImmutable('2025-08-10'));

        $this->entityManager->persist($trip);
        $this->entityManager->flush();

        $tripId = $trip->getId();

        // Delete the trip
        $this->entityManager->remove($trip);
        $this->entityManager->flush();

        // Verify deletion
        $deletedTrip = $this->tripRepository->find($tripId);
        $this->assertNull($deletedTrip);
    }

    public function testTripQueryOptimization(): void
    {
        // Create user
        $user = new User();
        $user->setEmail('query@test.com');
        $user->setUsername('queryuser');
        $user->setPassword('hashedpassword');
        $user->setRoles(['ROLE_USER']);
        
        $this->entityManager->persist($user);

        // Create multiple trips
        for ($i = 1; $i <= 5; $i++) {
            $trip = new Trip();
            $trip->setUser($user)
                 ->setCity("City $i")
                 ->setCountry("Country $i")
                 ->setStartDate(new \DateTimeImmutable("2025-08-0$i"))
                 ->setEndDate(new \DateTimeImmutable("2025-08-" . ($i + 5)));

            $this->entityManager->persist($trip);
        }
        
        $this->entityManager->flush();

        // Test ordering by date
        $trips = $this->tripRepository->findBy(
            ['user' => $user], 
            ['startDate' => 'ASC']
        );

        $this->assertCount(5, $trips);
        $this->assertEquals('City 1', $trips[0]->getCity());
        $this->assertEquals('City 5', $trips[4]->getCity());

        // Test ordering by date descending
        $tripsDesc = $this->tripRepository->findBy(
            ['user' => $user], 
            ['startDate' => 'DESC']
        );

        $this->assertEquals('City 5', $tripsDesc[0]->getCity());
        $this->assertEquals('City 1', $tripsDesc[4]->getCity());
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
