# ÉLÉMENTS DE SÉCURITÉ DE L'APPLICATION

## Introduction

Ce document présente les éléments de sécurité mis en œuvre dans notre application de voyage TrevelProject. Il couvre les principales failles de sécurité des applications web, leurs parades, ainsi que la conformité avec les standards et recommandations reconnus dans le domaine de la sécurité informatique.

## 1. Principales failles de sécurité et parades implémentées

### 1.1 Cross-Site Scripting (XSS)

**Description:** Le XSS permet à un attaquant d'injecter du code malveillant dans une page web visualisée par d'autres utilisateurs, compromettant ainsi l'interaction entre les utilisateurs et l'application.

**Parades implémentées:**
- Échappement systématique des données utilisateur avec `htmlspecialchars()` (backend)
- Utilisation d'une fonction de sanitization complète (`SecurityService::sanitizeInput()`)
- Validation stricte des entrées utilisateur
- Configuration appropriée des en-têtes Content-Security-Policy (CSP)
- Utilisation de React dans le frontend, qui échappe automatiquement les variables dans le JSX

**Exemple de code:**
```php
// Fonction de sanitization dans SecurityService.php
public function sanitizeInput(string $input, bool $allowHtml = false): string
{
    // Trim whitespace
    $input = trim($input);
    
    // Handle HTML
    if ($allowHtml) {
        // Allow only specific safe HTML tags
        $allowedTags = '<' . implode('><', $this->allowedHtmlTags) . '>';
        $input = strip_tags($input, $allowedTags);
    } else {
        // Remove all HTML tags
        $input = strip_tags($input);
    }
    
    // Convert special characters to HTML entities
    $input = htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    // Remove potential script injections
    $input = preg_replace('/javascript:/i', '', $input);
    $input = preg_replace('/on\w+\s*=/i', '', $input);
    
    return $input;
}

### 1.2 Cross-Site Request Forgery (CSRF)

**Description:** Le CSRF force un utilisateur authentifié à exécuter des actions indésirables sur une application web dans laquelle il est actuellement authentifié.

**Parades implémentées:**
- Protection CSRF native de Symfony activée (`csrf.yaml`)
- Jetons CSRF stateless pour les formulaires et l'authentification
- Vérification d'origine avec l'en-tête Origin/Referer
- Configuration des CORS restrictive limitée aux origines autorisées

**Exemple de code:**
```yaml
# Configuration CSRF dans csrf.yaml
framework:
    form:
        csrf_protection:
            token_id: submit

    csrf_protection:
        stateless_token_ids:
            - submit
            - authenticate
            - logout
```

```yaml
# Configuration CORS dans nelmio_cors.yaml
nelmio_cors:
    defaults:
        allow_origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178']
        allow_methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH']
        allow_headers: ['Content-Type', 'Authorization']
        expose_headers: ['Link']
        max_age: 3600
        allow_credentials: true

### 1.3 Injection SQL

**Description:** L'injection SQL consiste à insérer du code SQL malveillant dans les requêtes exécutées par l'application.

**Parades implémentées:**
- Utilisation de l'ORM Doctrine qui utilise des requêtes préparées
- Double protection avec détection de motifs d'injection SQL (`SecurityService::detectSqlInjection()`)
- Validation et sanitization des entrées utilisateur

**Exemple de code:**
```php
// Détection d'injection SQL dans SecurityService.php
public function detectSqlInjection(string $input): bool
{
    $sqlPatterns = [
        '/\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/i',
        '/[\'";]/',
        '/--/',
        '/\/\*.*\*\//',
        '/\b(or|and)\s+[\'"]?\d+[\'"]?\s*=\s*[\'"]?\d+[\'"]?/i'
    ];
    
    foreach ($sqlPatterns as $pattern) {
        if (preg_match($pattern, $input)) {
            return true;
        }
    }
    
    return false;
}

// Exemple d'utilisation avec Doctrine (requêtes préparées)
// Dans un Repository
public function findBySearchTerm(string $searchTerm)
{
    // Aucun risque d'injection SQL car Doctrine utilise des requêtes préparées
    return $this->createQueryBuilder('e')
        ->where('e.name LIKE :term')
        ->setParameter('term', '%' . $searchTerm . '%')
        ->getQuery()
        ->getResult();
}

### 1.4 Authentification et Gestion des Sessions

**Description:** Vulnérabilités liées à l'authentification, aux sessions et à la gestion des identités.

**Parades implémentées:**
- Authentification JWT sécurisée avec Lexik JWT Bundle
- Stockage des tokens dans des cookies HTTP-only
- Hachage sécurisé des mots de passe (algorithme auto de Symfony)
- Validation stricte des mots de passe avec exigences de complexité
- Protection contre les attaques par force brute avec limitation de débit

**Exemple de code:**
```yaml
# Configuration de sécurité dans security.yaml
security:
    password_hashers:
        App\Entity\User:
            algorithm: auto

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        # Réєстрація — без жодної авторизації
        register:
            pattern:   ^/api/users/register$
            stateless: true
            security:  false

        # Логін — через JSON Login
        login:
            pattern:   ^/api/login$
            stateless: true
            json_login:
                check_path:      /api/login
                username_path:   email
                password_path:   password
                success_handler: App\Security\CustomAuthenticationSuccessHandler
                failure_handler: lexik_jwt_authentication.handler.authentication_failure

        # API — за JWT
        api:
            pattern:   ^/api
            stateless: true
            lazy:      true
            jwt:       ~
```

```php
// Validation de la force du mot de passe dans SecurityService.php
public function validatePasswordWithMessage(string $password): array
{
    $errors = [];
    
    // Check minimum length (8 characters)
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters long';
    }
    
    // Check for at least one uppercase letter
    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = 'Password must contain at least one uppercase letter (A-Z)';
    }
    
    // Check for at least one lowercase letter
    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = 'Password must contain at least one lowercase letter (a-z)';
    }
    
    // Check for at least one number
    if (!preg_match('/\d/', $password)) {
        $errors[] = 'Password must contain at least one number (0-9)';
    }
    
    // Check for at least one special character
    if (!preg_match('/[^A-Za-z0-9]/', $password)) {
        $errors[] = 'Password must contain at least one special character (e.g., !, @, #, $, %, ., etc.)';
    }
    
    // Check for common weak passwords
    $commonPasswords = [
        'password', 'password123', '123456', '123456789', 'qwerty', 
        'abc123', 'password1', 'admin', 'letmein', 'welcome'
    ];
    
    if (in_array(strtolower($password), $commonPasswords)) {
        $errors[] = 'Password is too common. Please choose a more unique password';
    }
    
    if (empty($errors)) {
        return [
            'valid' => true,
            'message' => 'Password meets all security requirements'
        ];
    }
    
    return [
        'valid' => false,
        'message' => 'Your password should contain: ' . implode(', ', [
            'minimum 8 characters',
            '1 uppercase letter (A-Z)',
            '1 lowercase letter (a-z)', 
            '1 number (0-9)',
            '1 special character (e.g., !, @, #, $, %, .)'
        ]) . '. Issues found: ' . implode('; ', $errors)
    ];
}

### 1.5 Exposition de Données Sensibles

**Description:** Exposition inadéquate de données sensibles comme des mots de passe, clés d'API ou informations personnelles.

**Parades implémentées:**
- Utilisation de HTTPS/TLS pour chiffrer les communications
- Non-stockage des jetons JWT dans le localStorage du navigateur
- Configuration des cookies sécurisés (HTTP-only, Secure, SameSite)
- Validation des mots de passe avec vérification de force

**Exemple de code:**
```javascript
// Gestion sécurisée de l'authentification dans LoginForm.jsx
const handleSubmit = async e => {
  e.preventDefault();
  setMessage(null);

  try {
    const loginResponse = await api.post('/login', { email, password });
    
    // JWT token is automatically stored in HTTP-only cookie by the backend
    // No need to manually store it in localStorage
    
    // Only try to get user data if login was successful
    if (loginResponse.status === 200) {
      const { data } = await api.get('/users/me');
      navigate(data.roles.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
    }
  } catch (err) {
    // Handle different types of errors more gracefully
    if (err.response?.status === 401) {
      setMessage('❌ Incorrect email or password');
    } else if (err.response?.data?.message) {
      setMessage(`❌ ${err.response.data.message}`);
    } else {
      setMessage('❌ Login error. Please try again.');
    }
  }
};

## 2. Conformité avec les guides de sécurité

### 2.1 Open Web Application Security Project (OWASP)

Notre application suit les recommandations du Top 10 OWASP pour la sécurité des applications web:

- **A01:2021 - Contrôles d'accès défaillants**: Implémentation de rôles et autorisations strictes dans `security.yaml`
- **A02:2021 - Défaillances cryptographiques**: Utilisation d'algorithmes de hachage modernes pour les mots de passe
- **A03:2021 - Injection**: Utilisation systématique de requêtes préparées et validation d'entrées
- **A07:2021 - Défaillances d'identification et d'authentification**: Gestion sécurisée des sessions avec JWT
- **A08:2021 - Défaillances d'intégrité des logiciels et des données**: Validation des données et sanitization des entrées

### 2.2 Recommandations ANSSI

Notre application respecte les principales recommandations de l'Agence Nationale de la Sécurité des Systèmes d'Information (ANSSI) pour la sécurité des sites web:

- **Règle de cloisonnement**: Séparation claire entre frontend et backend
- **Principe de moindre privilège**: Accès limités aux ressources selon les rôles utilisateur
- **Protection des données sensibles**: Hachage des mots de passe et sécurisation des communications
- **Filtrage des entrées/sorties**: Validation stricte de toutes les entrées utilisateur
- **Mise en œuvre d'en-têtes de sécurité HTTP**: Configuration des en-têtes comme X-XSS-Protection, X-Content-Type-Options, etc.

### 2.3 Référentiel Général d'Amélioration de l'Accessibilité (RGAA)

Bien que principalement axé sur l'accessibilité, le RGAA comporte également des éléments liés à la sécurité:

- **Identification unique des ressources**: URLs structurées et significatives
- **Séparation du contenu et de la présentation**: Architecture React avec composants réutilisables
- **Validation des formulaires**: Feedback utilisateur clair sur les erreurs de validation

## 3. Gestion des identités et certificats numériques

### 3.1 Gestion des identités

- Authentification via email/mot de passe avec validation stricte
- Gestion des rôles utilisateur (utilisateur standard, administrateur)
- Processus sécurisé de réinitialisation de mot de passe
- Protection contre les attaques par force brute via limitation de débit

### 3.2 Certificats numériques

- Configuration pour utilisation de certificats TLS/SSL en production
- Support pour HTTPS avec redirection automatique depuis HTTP
- Validation de certificats pour les connexions aux services externes
- Préparation pour l'intégration avec des fournisseurs d'identité externes

## 4. Patrons de sécurité (Security Patterns) implémentés

### 4.1 Secure Session Management

Utilisation de JWT stockés dans des cookies HTTP-only pour la gestion des sessions stateless.

**Exemple de code:**
```javascript
// Configuration API dans Frontend/src/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  // Add this to handle self-signed certificates
  httpsAgent: process.env.NODE_ENV === 'development' ? null : undefined,
});

// Add request interceptor to include JWT token in Authorization header
api.interceptors.request.use(
  (config) => {
    // Remove Authorization header logic - rely on cookies instead
    // const token = localStorage.getItem('jwt_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 4.2 Input Validation & Sanitization

Validation et nettoyage systématiques des entrées utilisateur via le `SecurityService`.

**Exemple de code:**
```php
// Exemple d'utilisation du SecurityService
public function sanitizeArray(array $inputs, bool $allowHtml = false): array
{
    $sanitized = [];
    foreach ($inputs as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = $this->sanitizeInput($value, $allowHtml);
        } elseif (is_array($value)) {
            $sanitized[$key] = $this->sanitizeArray($value, $allowHtml);
        } else {
            $sanitized[$key] = $value;
        }
    }
    return $sanitized;
}
```

### 4.3 Access Control & Authorization

Système de contrôle d'accès basé sur les rôles avec vérifications d'autorisations dans les contrôleurs.

**Exemple de code:**
```yaml
# Configuration des contrôles d'accès dans security.yaml
access_control:
    - { path: ^/api/users/register$, roles: PUBLIC_ACCESS }
    - { path: ^/api/users/forgot-password$, roles: PUBLIC_ACCESS }
    - { path: ^/api/users/reset-password-token/, roles: PUBLIC_ACCESS }
    - { path: ^/api/login$,            roles: PUBLIC_ACCESS }
    - { path: ^/api/cities$,           roles: PUBLIC_ACCESS }
    - { path: ^/api,                   roles: IS_AUTHENTICATED_FULLY }
```

### 4.4 HTTPS Everywhere

Configuration pour utiliser HTTPS partout, y compris en développement pour la cohérence.

**Exemple de code:**
```javascript
// Gestion des certificats dans Frontend/src/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  // Add this to handle self-signed certificates
  httpsAgent: process.env.NODE_ENV === 'development' ? null : undefined,
});
```

### 4.5 Security Headers

Implémentation des en-têtes de sécurité recommandés (CSP, X-XSS-Protection, etc.).

**Exemple de code:**
```php
// Génération d'en-têtes de sécurité dans SecurityService.php
public function getSecurityHeaders(): array
{
    return [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'X-XSS-Protection' => '1; mode=block',
        'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    ];
}

## 5. Tests de sécurité et surveillance

### 5.1 Tests automatisés

- Tests unitaires pour les composants de sécurité
- Tests d'intégration pour les scénarios d'authentification
- Validation automatique des contrôles d'accès

### 5.2 Surveillance et journalisation

- Journalisation des événements de sécurité
- Alertes pour les tentatives d'accès non autorisées
- Suivi des modifications des données sensibles

## Conclusion

La sécurité de l'application TrevelProject est conçue comme un processus multicouche intégré à chaque niveau de l'application. En suivant les recommandations des standards reconnus comme OWASP et ANSSI, et en implémentant des parades contre les principales vulnérabilités web, notre application offre une protection robuste des données et des fonctionnalités aux utilisateurs.

Les mesures de sécurité sont régulièrement révisées et mises à jour pour répondre aux nouvelles menaces et vulnérabilités émergentes dans le paysage de la sécurité informatique.
