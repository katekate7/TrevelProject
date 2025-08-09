# Guide de Déploiement de l'Application Trevel

Ce document détaille le processus complet de déploiement de l'application Trevel, comprenant un backend Symfony, un frontend React, et une base de données MySQL à l'aide de Docker.

## Table des matières
1. [Préparation de l'environnement](#1-préparation-de-lenvironnement)
2. [Création des Dockerfiles](#2-création-des-dockerfiles)
3. [Configuration de Docker Compose](#3-configuration-de-docker-compose)
4. [Déploiement local](#4-déploiement-local)
5. [Publication sur DockerHub](#5-publication-sur-dockerhub)
6. [Déploiement sur serveur distant](#6-déploiement-sur-serveur-distant)

## 1. Préparation de l'environnement

Avant de commencer, assurez-vous d'avoir installé:
- Docker et Docker Compose
- Git (pour gérer votre code source)

```bash
# Vérifier l'installation de Docker
docker --version
docker-compose --version

# Cloner le projet (si ce n'est pas déjà fait)
git clone https://github.com/katekate7/TrevelProject.git
cd TrevelProject
```

## 2. Création des Dockerfiles

### 2.1 Dockerfile pour le backend (Symfony)

Le Dockerfile pour le backend est déjà présent dans `/backend/Dockerfile`. Voici son contenu et les explications:

```dockerfile
FROM php:8.2-apache

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo pdo_mysql intl zip opcache

# Installation de Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configuration d'Apache
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Répertoire de travail
WORKDIR /var/www/html

# Copie du code source
COPY . .

# Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader

# Permissions pour le répertoire var
RUN chown -R www-data:www-data var

# Exposition du port 80
EXPOSE 80

# Commande de démarrage
CMD ["apache2-foreground"]
```

**Explications:**
- Nous utilisons l'image PHP 8.2 avec Apache comme serveur web
- Nous installons les dépendances système nécessaires pour Symfony
- Les extensions PHP requises sont activées (pdo, pdo_mysql, etc.)
- Composer est installé pour gérer les dépendances PHP
- La configuration Apache est copiée pour définir le DocumentRoot
- Le code source est copié et les dépendances installées via Composer
- Les permissions sont ajustées pour le répertoire var (logs, cache)
- Le port 80 est exposé pour accéder à l'application web

### 2.2 Dockerfile pour le frontend (React)

Le Dockerfile pour le frontend est déjà présent dans `/Frontend/Dockerfile`. Voici son contenu et les explications:

```dockerfile
# Étape de build
FROM node:18-alpine AS build

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie de la configuration Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
```

**Explications:**
- Nous utilisons une approche multi-stage:
  1. **Étape de build**: Utilise Node.js pour installer les dépendances et compiler l'application React
  2. **Étape de production**: Utilise Nginx pour servir les fichiers statiques générés
- Cette approche permet d'avoir une image finale plus légère, ne contenant que les fichiers nécessaires
- Nginx est configuré pour servir l'application React sur le port 80
- L'application compilée est placée dans le répertoire par défaut de Nginx

## 3. Configuration de Docker Compose

Le fichier `docker-compose.yml` permet d'orchestrer le déploiement des différents services (backend, frontend, base de données). Voici son contenu et les explications:

```yaml
version: '3.8'

services:
  # Service de base de données
  db:
    image: mysql:8.0
    container_name: trevel_db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: travel_db
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    volumes:
      - db_data:/var/lib/mysql
      - ./travel_db.sql:/docker-entrypoint-initdb.d/travel_db.sql
    ports:
      - "3306:3306"
    networks:
      - trevel_network

  # Service backend (Symfony)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trevel_backend
    restart: unless-stopped
    depends_on:
      - db
    volumes:
      - ./backend:/var/www/html
      - /var/www/html/vendor
      - /var/www/html/var
    environment:
      DATABASE_URL: mysql://app_user:app_password@db:3306/travel_db
      JWT_SECRET_KEY: '%kernel.project_dir%/config/jwt/private.pem'
      JWT_PUBLIC_KEY: '%kernel.project_dir%/config/jwt/public.pem'
      JWT_PASSPHRASE: 'your_passphrase'
      APP_ENV: dev
    ports:
      - "8000:80"
    networks:
      - trevel_network

  # Service frontend (React)
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: trevel_frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"
    networks:
      - trevel_network

# Définition du réseau
networks:
  trevel_network:
    driver: bridge

# Définition des volumes
volumes:
  db_data:
```

**Explications:**
- **Structure du fichier**:
  - `services`: Définit les containers à déployer
  - `networks`: Définit le réseau partagé entre les containers
  - `volumes`: Définit les volumes persistants (pour la base de données)

- **Service db**:
  - Utilise l'image MySQL 8.0
  - Configure les variables d'environnement pour initialiser la base de données
  - Monte un volume persistant pour les données MySQL
  - Charge le fichier SQL initial pour créer les tables
  - Expose le port 3306 pour accéder à MySQL depuis l'hôte

- **Service backend**:
  - Construit l'image à partir du Dockerfile dans le dossier backend
  - Dépend du service db (attend que la base de données soit prête)
  - Monte le code source en volume pour faciliter le développement
  - Configure les variables d'environnement pour la connexion à la base de données et JWT
  - Expose le port 8000 pour accéder à l'API Symfony

- **Service frontend**:
  - Construit l'image à partir du Dockerfile dans le dossier Frontend
  - Dépend du service backend
  - Expose le port 80 pour accéder à l'application React

- **Réseau**:
  - Crée un réseau bridge nommé `trevel_network`
  - Permet aux containers de communiquer entre eux en utilisant les noms de service comme hostnames

## 4. Déploiement local

### 4.1 Lancement des containers

```bash
# Construction et démarrage des containers
docker-compose up -d --build

# Vérification des logs
docker-compose logs -f
```

### 4.2 Configuration initiale du backend

Une fois les containers démarrés, vous devez effectuer quelques opérations supplémentaires dans le container backend:

```bash
# Accès au container backend
docker-compose exec backend bash

# Mise à jour de Composer (si nécessaire)
composer update

# Création de la base de données (si elle n'existe pas déjà)
php bin/console doctrine:database:create --if-not-exists

# Exécution des migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Chargement des fixtures (données de test)
php bin/console doctrine:fixtures:load --no-interaction

# Génération des clés JWT (si elles ne sont pas déjà générées)
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem

# Sortie du container
exit
```

### 4.3 Modification de fichiers dans les containers

Si vous avez besoin de modifier des fichiers dans les containers (par exemple, le fichier .env), vous pouvez:

```bash
# Installation de nano dans le container
docker-compose exec backend bash -c "apt-get update && apt-get install -y nano"

# Édition d'un fichier
docker-compose exec backend nano .env
```

Mais la méthode recommandée est de modifier les fichiers directement dans votre dossier local, car les volumes sont montés:

```bash
# Édition locale du fichier .env
nano backend/.env
```

### 4.4 Vérification du déploiement

Après le déploiement, vous pouvez accéder à:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- Base de données: localhost:3306 (avec un client MySQL)

## 5. Publication sur DockerHub

### 5.1 Connexion à DockerHub

```bash
# Connexion à DockerHub
docker login
# Entrez votre nom d'utilisateur et mot de passe DockerHub
```

### 5.2 Création des tags et publication

```bash
# Création des tags pour les images
docker tag trevelproject_backend:latest (your_name)/trevel-backend:latest
docker tag trevelproject_frontend:latest katekate7/trevel-frontend:latest
docker tag mysql:8.0 katekate7/trevel-db:latest

# Publication des images sur DockerHub
docker push katekate7/trevel-backend:latest
docker push katekate7/trevel-frontend:latest
docker push katekate7/trevel-db:latest
```

## 6. Déploiement sur serveur distant

### 6.1 Choix du serveur

Vous pouvez utiliser:
- Des fournisseurs cloud payants comme AWS, Google Cloud, Azure, DigitalOcean
- Des options gratuites comme Oracle Cloud Free Tier, Heroku (limité), Railway.app

### 6.2 Connexion SSH au serveur

```bash
# Connexion SSH (remplacez USER et IP)
ssh utilisateur@123.456.789.101

# Exemple avec une clé SSH spécifique
ssh -i /chemin/vers/cle.pem utilisateur@123.456.789.101
```

### 6.3 Installation de Docker sur le serveur

```bash
# Mise à jour des paquets
sudo apt update
sudo apt upgrade -y

# Installation des prérequis
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajout de la clé GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Ajout du référentiel Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Installation de Docker et Docker Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose

# Ajout de l'utilisateur courant au groupe docker
sudo usermod -aG docker ${USER}
newgrp docker
```

### 6.4 Déploiement avec Docker Compose

```bash
# Connexion SSH au serveur distant (remplacez <utilisateur> et <IP_adresse> par vos valeurs)
ssh <utilisateur>@<IP_adresse>

# Récupération du fichier docker-compose directement depuis un référentiel
# Adaptez cette URL avec votre propre référentiel si nécessaire
curl https://raw.githubusercontent.com/fredericBui/symfony_react_docker_compose_deployment/refs/heads/main/compose.yaml -o compose.yaml

# Lancement des containers
docker compose up -d
```

Une fois les containers démarrés, vous devez configurer la base de données:

```bash
# Accès au container backend (remplacez 'trevel_backend' par le nom de votre container)
docker exec -it trevel_backend bash

# Suppression des migrations existantes et création de nouvelles migrations
rm -Rf migrations
mkdir migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

Après déploiement, vous pouvez accéder à:
- Frontend: http://<IP_Adresse>:3000/
- Backend API: http://<IP_Adresse>:8089/

### 6.4.1 Test de l'API

Vous pouvez tester l'API avec les commandes curl suivantes:

```bash
# Exemple de création d'une ressource (POST)
curl -X 'POST' \
  'http://<IP_Adresse>:8089/api/posts' \
  -H 'accept: application/ld+json' \
  -H 'Content-Type: application/ld+json' \
  -d '{
  "content": "hello world"
}'

# Exemple de récupération de ressources (GET)
curl -X 'GET' \
  'http://<IP_Adresse>:8089/api/posts?page=1' \
  -H 'accept: application/ld+json'
```

### 6.4.2 Automatisation des déploiements avec Jenkins

Pour mettre en place un système d'intégration continue:

```bash
# Création et démarrage du répertoire pour CI/CD
mkdir -p cicd
cd cicd
# Ajoutez ici votre fichier docker-compose pour Jenkins
docker compose up -d

# Vérification des logs de Jenkins
docker logs jenkins_container

# Construction de l'image pour l'agent Jenkins
docker build . -t jenkins_agent

# Inspection du container Jenkins pour obtenir l'adresse IP
docker inspect jenkins_container

# Lancement de l'agent Jenkins
# Remplacez <IP_adress_jenkins_container>, <secret> et <agent name> par vos valeurs
docker run --init --name jenkins_agent_container --network cicd_network \
  -v /var/run/docker.sock:/var/run/docker.sock jenkins_agent \
  -url http://<IP_adress_jenkins_container>:8080 <secret> <agent name>
```

### 6.4.3 Suppression des déploiements

Si vous souhaitez supprimer votre déploiement:

```bash
# Arrêt des containers
docker compose down

# Suppression du volume de la base de données
docker volume rm root_db_data
```

### 6.5 Configuration d'un nom de domaine (optionnel)

Pour associer un nom de domaine à votre application:
1. Achetez un nom de domaine (Namecheap, GoDaddy, OVH, etc.)
2. Configurez les enregistrements DNS pour pointer vers l'adresse IP de votre serveur
3. Installez un proxy inverse comme Nginx ou Traefik pour gérer les noms d'hôtes et les certificats SSL

### 6.6 Configuration HTTPS avec Let's Encrypt (optionnel)

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtention d'un certificat SSL (remplacez example.com)
sudo certbot --nginx -d example.com -d www.example.com
```

## Conclusion

Vous avez maintenant déployé avec succès l'application Trevel, comprenant:
- Un backend Symfony
- Un frontend React
- Une base de données MySQL
- Une configuration Docker complète

Cette configuration vous permet de:
- Développer localement avec Docker
- Publier vos images sur DockerHub
- Déployer facilement sur n'importe quel serveur supportant Docker

Pour toute question ou amélioration, n'hésitez pas à consulter la documentation Docker ou à contacter l'équipe de développement.
