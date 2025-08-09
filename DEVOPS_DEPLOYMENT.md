# 1.3.3. Contribuer à la Mise en Production dans une Démarche DevOps

## Table des matières
1. [Introduction à la démarche DevOps](#1-introduction-à-la-démarche-devops)
2. [Outils d'intégration et de déploiement continus](#2-outils-dintégration-et-de-déploiement-continus)
3. [Implémentation GitHub Actions](#3-implémentation-github-actions)
4. [Pipelines de déploiement](#4-pipelines-de-déploiement)
5. [Sécurité dans le processus DevOps](#5-sécurité-dans-le-processus-devops)
6. [Surveillance et maintenance](#6-surveillance-et-maintenance)
7. [Bonnes pratiques](#7-bonnes-pratiques)

## 1. Introduction à la démarche DevOps

La démarche DevOps adoptée pour le projet Trevel vise à optimiser la collaboration entre les équipes de développement (Dev) et d'exploitation (Ops), permettant ainsi une livraison continue et fiable des nouvelles fonctionnalités. Cette approche nous permet de:

- **Accélérer les cycles de livraison** en automatisant les processus d'intégration et de déploiement
- **Améliorer la qualité du code** grâce à des tests automatisés systématiques
- **Sécuriser l'application** en intégrant des vérifications de sécurité dans le pipeline
- **Faciliter la résolution des problèmes** via une détection précoce des anomalies

Le projet Trevel utilise une architecture microservices avec un backend Symfony, un frontend React et une base de données MySQL, tous conteneurisés via Docker pour garantir la cohérence entre les environnements.

## 2. Outils d'intégration et de déploiement continus

### 2.1. GitHub Actions (principal)

Pour ce projet, nous utilisons principalement **GitHub Actions** comme outil d'intégration et de déploiement continus. GitHub Actions offre:

- Une intégration transparente avec le dépôt GitHub
- Des workflows personnalisables définis dans des fichiers YAML
- Une exécution dans des environnements éphémères (runners)
- La possibilité d'utiliser des actions prédéfinies ou personnalisées

Nos workflows GitHub Actions sont configurés pour s'exécuter automatiquement lors de push sur les branches principales ou lors de pull requests. Les fichiers de configuration se trouvent dans les répertoires `.github/workflows/` de chaque partie du projet.

### 2.2. Jenkins (alternative)

En parallèle, nous maintenons également des pipelines **Jenkins** comme alternative ou pour des besoins spécifiques. Jenkins est utilisé pour:

- Des environnements où l'auto-hébergement est préféré à l'exécution dans le cloud
- Des processus nécessitant une intégration avec des systèmes internes
- Certaines tâches de déploiement spécifiques

Les Jenkinsfiles présents dans les dossiers du projet (`/`, `/backend`, `/Frontend`) définissent ces pipelines alternatifs.

## 3. Implémentation GitHub Actions

Pour ce projet, j'ai implémenté des workflows GitHub Actions pour automatiser l'intégration et le déploiement continus. Ces workflows sont définis dans des fichiers YAML situés dans les répertoires `.github/workflows/` respectifs.

### 3.1. Configuration pour le Backend

Le fichier de workflow pour le backend se trouve dans:
`/backend/.github/workflows/backend.yml`

Ce fichier définit le workflow complet d'intégration, de test et de déploiement pour l'application backend Symfony. Voici les principales caractéristiques de cette configuration:

- **Déclencheurs**: Le workflow s'exécute lors des push sur les branches `main` et `develop`, ainsi que lors des pull requests vers `main`.
- **Jobs**: Le workflow est organisé en trois jobs principaux:
  - `test`: Exécute les tests unitaires et fonctionnels
  - `security-check`: Analyse les vulnérabilités de sécurité
  - `build-and-deploy`: Construit et déploie l'application (uniquement sur la branche main)
  
- **Services**: Configuration d'un service MySQL pour les tests d'intégration.
- **Gestion des secrets**: Utilisation des secrets GitHub pour les informations sensibles.

### 3.2. Configuration pour le Frontend

Le fichier de workflow pour le frontend se trouve dans:
`/Frontend/.github/workflows/frontend.yml`

Ce workflow gère le processus CI/CD pour l'application React frontend:

- **Déclencheurs**: Identiques au backend (push sur main/develop, PRs vers main).
- **Jobs**: Organisés en deux jobs principaux:
  - `test`: Exécute les tests et vérifie la qualité du code
  - `build-and-deploy`: Construit l'application et crée/déploie l'image Docker

Ces configurations permettent d'automatiser entièrement le processus de test, de construction et de déploiement des deux parties de l'application.

## 4. Pipelines de déploiement

### 4.1. Pipeline backend (Symfony)

Notre pipeline backend comprend les étapes suivantes:

1. **Intégration continue**:
   - Récupération du code depuis le dépôt GitHub
   - Installation des dépendances via Composer
   - Exécution des tests unitaires et fonctionnels
   - Analyse statique du code
   - Vérification des vulnérabilités de sécurité

2. **Livraison continue**:
   - Construction de l'image Docker pour le backend
   - Publication de l'image sur DockerHub avec tags appropriés
   - Tests de l'image dans un environnement de staging

3. **Déploiement continu**:
   - Déploiement sur l'environnement de production
   - Migrations de base de données
   - Tests post-déploiement
   - Notification de l'équipe

### 4.2. Pipeline frontend (React)

Le pipeline frontend suit un processus similaire:

1. **Intégration continue**:
   - Récupération du code depuis le dépôt GitHub
   - Installation des dépendances via npm
   - Exécution des tests unitaires et d'intégration
   - Analyse du code et vérification des bonnes pratiques

2. **Livraison continue**:
   - Build de l'application React
   - Construction de l'image Docker
   - Publication de l'image sur DockerHub
   - Déploiement en environnement de staging

3. **Déploiement continu**:
   - Déploiement sur l'environnement de production
   - Tests d'acceptation automatisés
   - Notification de l'équipe

### 4.3. Exemple de configuration Jenkins

Voici un exemple du pipeline Jenkins utilisé pour le backend:

```groovy
pipeline {
    agent {
        label "${AGENT}"
    }

    stages {
        stage("Continuous Integration / Intégration Continue") {
            steps {
                git branch: "main", url: "https://github.com/katekate7/TrevelProject-Backend.git"
                sh "composer install"
            }
        }
        stage("Continuous Delivery / Livraison Continue") {
            steps {
                sh "docker build -f Dockerfile -t ${DOCKERHUB_USERNAME}/travel-backend ."
                sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
                sh "docker push ${DOCKERHUB_USERNAME}/travel-backend"
            }
        }
    }
}
```

### 4.4. Exemple de workflow GitHub Actions

```yaml
# Extrait du fichier backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main" ]

env:
  PHP_VERSION: '8.2'
  IMAGE_NAME: travel-backend

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: travel_test
        ports:
          - 3306:3306

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}
          extensions: mbstring, xml, ctype, iconv, intl, pdo, pdo_mysql
          
      - name: Install dependencies
        run: composer install --no-progress --prefer-dist --optimize-autoloader
        
      - name: Run database migrations
        run: php bin/console doctrine:migrations:migrate --env=test --no-interaction
        
      - name: Run PHPUnit tests
        run: php bin/phpunit --coverage-text
        
  build-and-deploy:
    name: Build and Deploy
    needs: [test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: kate0079887
          password: ${{ secrets.KATE0079887 }}
        
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: kate0079887/travel-backend:latest
```

Voici également l'extrait du fichier workflow pour le frontend:

```yaml
# Extrait du fichier frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main" ]

env:
  NODE_VERSION: '18'
  IMAGE_NAME: travel-frontend

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    needs: [test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build React app
        run: npm run build
        
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: kate0079887/travel-frontend:latest
```

## 5. Sécurité dans le processus DevOps

La sécurité est intégrée à chaque étape du processus DevOps:

- **Analyse de dépendances**: Vérification des vulnérabilités dans les bibliothèques tierces via `composer audit` et `npm audit`
- **Analyse de code statique**: Détection de problèmes de sécurité potentiels dans le code
- **Tests de sécurité**: Exécution de tests spécifiques pour vérifier l'absence de vulnérabilités courantes
- **Gestion sécurisée des secrets**: Utilisation des secrets GitHub et des variables d'environnement Jenkins
- **Scan des images Docker**: Vérification des vulnérabilités dans les images avant déploiement

## 6. Surveillance et maintenance

Après le déploiement, notre processus DevOps inclut:

- **Surveillance continue** de l'application en production via des outils de monitoring
- **Alertes automatisées** en cas de problème détecté
- **Journalisation centralisée** pour faciliter le débogage
- **Rollback automatisé** en cas d'échec critique lors du déploiement

## 7. Bonnes pratiques

Dans notre démarche DevOps, nous suivons plusieurs bonnes pratiques:

- **Infrastructure as Code (IaC)**: Configuration de l'infrastructure via Docker et docker-compose
- **Tests automatisés**: Tests unitaires, d'intégration et end-to-end systématiques
- **Déploiements blue/green**: Pour minimiser les temps d'arrêt lors des mises à jour
- **Feature flags**: Activation progressive des fonctionnalités pour limiter les risques
- **Revue de code**: Obligatoire avant toute fusion dans les branches principales
- **Documentation à jour**: Documentation systématique des processus et configurations

Notre démarche DevOps est en constante évolution et s'adapte régulièrement aux besoins du projet et aux nouvelles technologies disponibles.
