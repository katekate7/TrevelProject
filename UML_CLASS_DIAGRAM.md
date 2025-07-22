# UML Class Diagram - Travel Project Database Schema

## 5.4.5. Diagramme de classes (UML) - Avec méthodes complètes

## Entity Relationship Diagram

Based on your Symfony travel project, here's the detailed UML class diagram with complete method specifications:

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│             User                │    │             Trip                │    │            Place                │
├─────────────────────────────────┤    ├─────────────────────────────────┤    ├─────────────────────────────────┤
│ • id int                        │    │ • id int                        │    │ • id int                        │
│ • username string(180)          │    │ • city string(50)               │    │ • name string(100)              │
│ • email string(255)             │    │ • country string(50)            │    │ • lat float                     │
│ • password string(255)          │    │ • createdAt datetime_immutable  │    │ • lng float                     │
│ • role string(20)               │    │ • startDate datetime_immutable  │    │ • trip_id int                   │
│ • createdAt datetime_immutable  │    │ • endDate datetime_immutable    │    │                                 │
│                                 │    │ • sightseeings text             │    │ MÉTHODES D'ACCÈS:               │
│ MÉTHODES D'ACCÈS:               │    │ • user_id int                   │    │ + getId(): ?int                 │
│ + getId(): ?int                 │    │                                 │    │ + getName(): string             │
│ + getUsername(): string         │    │ MÉTHODES D'ACCÈS:               │    │ + setName(string): self         │
│ + setUsername(string): self     │    │ + getId(): ?int                 │    │ + getLat(): float               │
│ + getEmail(): string            │    │ + getCity(): string             │    │ + setLat(float): self           │
│ + setEmail(string): self        │    │ + setCity(string): self         │    │ + getLng(): float               │
│ + getPassword(): string         │    │ + getCountry(): string          │    │ + setLng(float): self           │
│ + setPassword(string): self     │    │ + setCountry(string): self      │    │                                 │
│ + getRole(): string             │    │ + getCreatedAt(): DateTimeImmutable │ MÉTHODES DE RELATION:           │
│ + setRole(string): self         │    │ + getStartDate(): ?DateTimeImmutable │ + getTrip(): ?Trip              │
│ + getCreatedAt(): DateTimeImmutable │ + setStartDate(?DateTimeImmutable): self │ + setTrip(Trip): self      │
│ + setCreatedAt(DateTimeImmutable): self │ + getEndDate(): ?DateTimeImmutable │                            │
│                                 │    │ + setEndDate(?DateTimeImmutable): self │                             │
│ MÉTHODES SÉCURITÉ:              │    │ + getSightseeings(): ?string    │                                 │
│ + getRoles(): array             │    │ + setSightseeings(?string): self │                                │
│ + getUserIdentifier(): string   │    │                                 │                                 │
│ + eraseCredentials(): void      │    │ MÉTHODES DE RELATION:           │                                 │
│                                 │    │ + getUser(): ?User              │                                 │
│ GESTION DES VOYAGES:            │    │ + setUser(?User): self          │                                 │
│ + getTrips(): Collection        │    │ + getWeather(): ?Weather        │                                 │
│ + addTrip(Trip): self           │    │ + setWeather(?Weather): self    │                                 │
│ + removeTrip(Trip): self        │    │ + getPlaces(): Collection       │                                 │
│                                 │    │ + addPlace(Place): self         │                                 │
│ GESTION DES DEMANDES:           │    │ + removePlace(Place): self      │                                 │
│ + getItemRequests(): Collection │    │                                 │                                 │
│ + addItemRequest(ItemRequest): self │ │                                │                                 │
│ + removeItemRequest(ItemRequest): self │                              │                                 │
└─────────────────────────────────┘    └─────────────────────────────────┘    └─────────────────────────────────┘


┌─────────────────────────────────┐    ┌─────────────────────────────────┐    
│           Weather               │    │             Item                │    
├─────────────────────────────────┤    ├─────────────────────────────────┤    
│ • id int                        │    │ • id int                        │    
│ • temperature float             │    │ • name string(100)              │    
│ • weatherDescription string(255) │   │ • important boolean             │    
│ • forecast json                 │    │                                 │    
│ • updatedAt datetime_immutable  │    │ MÉTHODES D'ACCÈS:               │    
│ • trip_id int                   │    │ + getId(): ?int                 │    
│                                 │    │ + getName(): string             │    
│ MÉTHODES D'ACCÈS:               │    │ + setName(string): self         │    
│ + getId(): ?int                 │    │ + isImportant(): bool           │    
│ + getTemperature(): ?float      │    │ + setImportant(bool): self      │    
│ + setTemperature(?float): self  │    │                                 │    
│ + getWeatherDescription(): ?string │ │ GESTION DES VOYAGES:            │    
│ + setWeatherDescription(?string): self │ + getTripItems(): Collection    │    
│ + getForecast(): array          │    │ + addTripItem(TripItem): self   │    
│ + setForecast(array): self      │    │ + removeTripItem(TripItem): self │    
│ + getUpdatedAt(): ?DateTimeImmutable │ │                                │    
│ + setUpdatedAt(?DateTimeImmutable): self │                             │    
│                                 │    │                                 │    
│ MÉTHODES DE RELATION:           │    │                                 │    
│ + getTrip(): ?Trip              │    │                                 │    
│ + setTrip(?Trip): self          │    │                                 │    
└─────────────────────────────────┘    └─────────────────────────────────┘    


┌─────────────────────────────────┐    ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│          TripItem               │    │        ItemRequest              │    │    PasswordResetRequest         │
├─────────────────────────────────┤    ├─────────────────────────────────┤    ├─────────────────────────────────┤
│ • id int                        │    │ • id int                        │    │ • id int                        │
│ • isChecked boolean             │    │ • name string(100)              │    │ • token string(64)              │
│ • trip_id int                   │    │ • status string(20)             │    │ • createdAt datetime_immutable  │
│ • item_id int                   │    │ • user_id int                   │    │ • user_id int                   │
│ • addedBy_id int                │    │                                 │    │                                 │
│                                 │    │ MÉTHODES D'ACCÈS:               │    │ MÉTHODES D'ACCÈS:               │
│ MÉTHODES D'ACCÈS:               │    │ + getId(): ?int                 │    │ + getId(): ?int                 │
│ + getId(): ?int                 │    │ + getName(): string             │    │ + getToken(): string            │
│ + isChecked(): bool             │    │ + setName(string): self         │    │ + getCreatedAt(): DateTimeImmutable │
│ + setChecked(bool): self        │    │ + getStatus(): string           │    │                                 │
│                                 │    │ + setStatus(string): self       │    │ MÉTHODES DE RELATION:           │
│ GESTION DES RELATIONS:          │    │                                 │    │ + getUser(): User               │
│ + getTrip(): ?Trip              │    │ MÉTHODES DE RELATION:           │    │                                 │
│ + setTrip(?Trip): self          │    │ + getUser(): ?User              │    │ MÉTHODES MÉTIER:                │
│ + getItem(): ?Item              │    │ + setUser(?User): self          │    │ + __construct(User): void       │
│ + setItem(?Item): self          │    │                                 │    │ + isExpired(): bool             │
│ + getAddedBy(): ?User           │    │ MÉTHODES MÉTIER:                │    │ + isValid(): bool               │
│ + setAddedBy(?User): self       │    │ + isPending(): bool             │    │                                 │
│                                 │    │ + isApproved(): bool            │    │                                 │
│ MÉTHODES MÉTIER:                │    │ + isRejected(): bool            │    │                                 │
│ + toggle(): self                │    │ + approve(): self               │    │                                 │
│ + check(): self                 │    │ + reject(): self                │    │                                 │
│ + uncheck(): self               │    │ + reset(): self                 │    │                                 │
└─────────────────────────────────┘    └─────────────────────────────────┘    └─────────────────────────────────┘
```

## Relationships Overview

```
User ──────── 1:N ──────── Trip
  │                         │
  │                         │ 1:1
  │                         │
  │                      Weather
  │ 1:N                     │
  │                         │ 1:N
ItemRequest               Place
  │
  │
  │ 1:N                   1:N │
  └── TripItem ────────────── Item
         │
         │ N:1
         │
       User (addedBy)

User ────── 1:N ────── PasswordResetRequest
```

## Database Schema Details

### Table: `user`
- **Primary Key**: `id` (auto-increment)
- **Unique Constraints**: `username`, `email`
- **Default Values**: `role = 'user'`, `createdAt = CURRENT_TIMESTAMP`
- **Implements**: `UserInterface`, `PasswordAuthenticatedUserInterface`

### Table: `trip`
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: 
  - `user_id` → `user(id)` ON DELETE CASCADE
- **Nullable Fields**: `startDate`, `endDate`, `sightseeings`
- **Default Values**: `createdAt = CURRENT_TIMESTAMP`

### Table: `place`
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: 
  - `trip_id` → `trip(id)` ON DELETE CASCADE
- **Required Fields**: `name`, `lat`, `lng`

### Table: `weather`
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: 
  - `trip_id` → `trip(id)` ON DELETE CASCADE (Unique)
- **Nullable Fields**: `temperature`, `weatherDescription`, `updatedAt`
- **JSON Field**: `forecast`

### Table: `item`
- **Primary Key**: `id` (auto-increment)
- **Unique Constraints**: `name`
- **Default Values**: `important = false`

### Table: `trip_item` (Junction Table)
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**:
  - `trip_id` → `trip(id)` ON DELETE CASCADE
  - `item_id` → `item(id)` ON DELETE CASCADE
  - `addedBy_id` → `user(id)` ON DELETE SET NULL
- **Default Values**: `isChecked = false`

### Table: `item_request`
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: 
  - `user_id` → `user(id)` ON DELETE CASCADE
- **Default Values**: `status = 'pending'`

### Table: `password_reset_request`
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: 
  - `user_id` → `user(id)` ON DELETE CASCADE
- **Unique Constraints**: `token`
- **Token Generation**: 64 hex chars (32 bytes random)

## Field Type Specifications

### String Types:
- `string(20)` - Short identifiers (role, status)
- `string(50)` - Medium text (city, country)
- `string(64)` - Tokens
- `string(100)` - Names (place, item)
- `string(180)` - Username (Symfony standard)
- `string(255)` - Email, password, descriptions
- `text` - Long content (sightseeings)

### Numeric Types:
- `int` - Primary keys, foreign keys
- `float` - Coordinates (lat, lng), temperature
- `boolean` - Flags (important, isChecked)

### Date Types:
- `datetime_immutable` - All timestamp fields

### Special Types:
- `json` - Weather forecast data
- `array` (Collection) - Doctrine collections for relationships

## Security Considerations

1. **Password Hashing**: Handled by Symfony's password hasher
2. **Token Security**: 32-byte random tokens for password reset
3. **Cascade Deletions**: Proper cleanup of related data
4. **Role-Based Access**: User roles (user/admin)
5. **Email Uniqueness**: Prevents duplicate accounts

## Méthodes métier supplémentaires recommandées

### User - Méthodes utilitaires:
```php
+ isAdmin(): bool                     // Vérifie si l'utilisateur est admin
+ hasRole(string $role): bool         // Vérifie un rôle spécifique
+ getFullName(): string               // Nom complet (si prénom/nom ajoutés)
+ isActive(): bool                    // Statut actif/inactif
+ getTripsCount(): int                // Nombre de voyages
+ getLastLoginAt(): ?DateTimeImmutable // Dernière connexion
+ canCreateTrip(): bool               // Permissions de création
```

### Trip - Méthodes métier:
```php
+ getDuration(): ?int                 // Durée en jours
+ isActive(): bool                    // Voyage en cours
+ isPast(): bool                      // Voyage terminé
+ isFuture(): bool                    // Voyage à venir
+ getPlacesCount(): int               // Nombre de lieux
+ getItemsCount(): int                // Nombre d'éléments
+ getProgress(): float                // Pourcentage de préparation
+ hasWeatherData(): bool              // Données météo disponibles
+ isOwner(User $user): bool           // Vérification propriétaire
+ canEdit(User $user): bool           // Permissions d'édition
+ getDestination(): string            // Format "City, Country"
```

### Weather - Méthodes métier:
```php
+ isOutdated(): bool                  // Données obsolètes
+ needsUpdate(): bool                 // Mise à jour nécessaire
+ getTemperatureInFahrenheit(): ?float // Conversion température
+ isSunny(): bool                     // Temps ensoleillé
+ isRainy(): bool                     // Temps pluvieux
+ getFormattedDescription(): string   // Description formatée
+ getForecastForDate(DateTime $date): ?array // Prévision date
```

### Item - Méthodes métier:
```php
+ getUsageCount(): int                // Nombre d'utilisations
+ isPopular(): bool                   // Élément populaire
+ getCategories(): array              // Catégories d'éléments
+ markAsImportant(): self             // Marquer important
+ unmarkAsImportant(): self           // Retirer important
```

### TripItem - Méthodes métier:
```php
+ toggleCheck(): self                 // Basculer état coché
+ markAsChecked(): self               // Marquer comme fait
+ markAsUnchecked(): self             // Marquer comme non fait
+ isAddedByOwner(): bool              // Ajouté par propriétaire
+ getAddedDate(): ?DateTimeImmutable  // Date d'ajout
```

### ItemRequest - Méthodes de statut:
```php
+ approve(): self                     // Approuver la demande
+ reject(): self                      // Rejeter la demande
+ isPending(): bool                   // En attente
+ isApproved(): bool                  // Approuvée
+ isRejected(): bool                  // Rejetée
+ getStatusLabel(): string            // Libellé du statut
+ canBeApproved(): bool               // Peut être approuvée
```

### PasswordResetRequest - Méthodes de sécurité:
```php
+ isExpired(): bool                   // Token expiré (ex: 1h)
+ isValid(): bool                     // Token valide
+ getRemainingTime(): int             // Temps restant (minutes)
+ invalidate(): self                  // Invalider le token
+ regenerateToken(): self             // Régénérer le token
```

## Méthodes de validation et de business logic

### Validation des données:
```php
// User
+ validateEmail(string $email): bool
+ validatePassword(string $password): bool
+ isUsernameAvailable(string $username): bool

// Trip
+ validateDates(): bool               // Cohérence des dates
+ validateDestination(): bool         // Destination valide

// Place
+ validateCoordinates(): bool         // Coordonnées valides
+ isLocationValid(): bool             // Localisation cohérente

// Weather
+ validateTemperature(): bool         // Température réaliste
+ validateForecast(): bool            // Prévisions cohérentes
```

## Méthodes de formatage et d'affichage

### Formatage des données:
```php
// Trip
+ getFormattedDates(): string         // "Du 01/01/2024 au 15/01/2024"
+ getShortDescription(): string       // Description courte

// Weather
+ getFormattedTemperature(): string   // "25°C"
+ getFormattedForecast(): array       // Prévisions formatées

// User
+ getDisplayName(): string            // Nom d'affichage
+ getInitials(): string               // Initiales
```

## Relations et collections étendues

### Méthodes de recherche:
```php
// User
+ getTripsByStatus(string $status): Collection
+ getRecentTrips(int $limit = 5): Collection
+ getActiveTrips(): Collection

// Trip
+ getPlacesByType(string $type): Collection
+ getImportantItems(): Collection
+ getCheckedItems(): Collection
+ getUncheckedItems(): Collection
```
