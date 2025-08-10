# Guide d'Installation et de Configuration de l'Environnement de Travail

## Table des matières
1. [Introduction](#introduction)
2. [Prérequis logiciels](#prérequis-logiciels)
3. [Installation des outils de développement](#installation-des-outils-de-développement)
4. [Configuration du système de gestion de versions](#configuration-du-système-de-gestion-de-versions)
5. [Configuration des conteneurs Docker](#configuration-des-conteneurs-docker)
6. [Configuration de l'environnement Backend (Symfony)](#configuration-de-lenvironnement-backend-symfony)
7. [Configuration de l'environnement Frontend (React)](#configuration-de-lenvironnement-frontend-react)
8. [Intégration avec les plateformes collaboratives](#intégration-avec-les-plateformes-collaboratives)
9. [Sécurisation de l'environnement de développement](#sécurisation-de-lenvironnement-de-développement)

## Introduction

Ce document décrit les étapes nécessaires pour installer et configurer l'environnement de développement du projet TrevelProject, une application de voyage sécurisée. Il est destiné aux développeurs rejoignant l'équipe et fournit les instructions pour mettre en place un environnement conforme aux standards du projet.

## Prérequis logiciels

Avant de commencer la configuration de l'environnement de développement, assurez-vous d'avoir installé les logiciels suivants:

| Logiciel | Version | Description |
|----------|---------|-------------|
| Git | 2.40.0+ | Système de contrôle de version |
| Docker | 24.0.0+ | Plateforme de conteneurisation |
| Docker Compose | 2.17.0+ | Outil pour définir et exécuter des applications Docker multi-conteneurs |
| PHP | 8.2+ | Langage de programmation pour le backend |
| Composer | 2.5.0+ | Gestionnaire de dépendances PHP |
| Node.js | 18.0.0+ | Environnement d'exécution JavaScript |
| npm | 9.0.0+ | Gestionnaire de paquets Node.js |
| IDE | - | VSCode, PhpStorm ou équivalent |

## Installation des outils de développement

### Installation sur macOS

```bash
# Installation de Homebrew si non installé
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installation de Git
brew install git

# Installation de Docker Desktop (inclut Docker et Docker Compose)
brew install --cask docker

# Installation de PHP et Composer
brew install php
brew install composer

# Installation de Node.js et npm
brew install node

# Installation de VS Code (optionnel)
brew install --cask visual-studio-code
```

### Installation sur Linux (Ubuntu/Debian)

```bash
# Mise à jour des paquets
sudo apt update

# Installation de Git
sudo apt install -y git

# Installation de Docker et Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# Installation de PHP et Composer
sudo apt install -y php8.2 php8.2-cli php8.2-common php8.2-curl php8.2-xml php8.2-mbstring php8.2-mysql php8.2-zip
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Installation de Node.js et npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

## Configuration du système de gestion de versions

Pour ce projet, nous utilisons Git avec GitHub comme plateforme collaborative.

### Configuration initiale de Git

```bash
# Configuration de l'identité Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configuration des fins de ligne
git config --global core.autocrlf input  # Pour macOS/Linux
# git config --global core.autocrlf true  # Pour Windows

# Configuration de l'éditeur (optionnel)
git config --global core.editor "code --wait"  # Pour VS Code
```

### Clonage du dépôt

```bash
# Clonage du dépôt principal
git clone https://github.com/katekate7/TrevelProject.git
cd TrevelProject

# Configuration du dépôt distant
git remote add origin https://github.com/katekate7/TrevelProject.git
```

### Bonnes pratiques Git

- Créer une branche pour chaque nouvelle fonctionnalité ou correction de bug
- Utiliser des messages de commit descriptifs en anglais
- Synchroniser régulièrement avec la branche principale
- Effectuer des revues de code avant de fusionner les branches

```bash
# Exemple de création d'une nouvelle branche
git checkout -b feature/nom-fonctionnalite

# Après modifications, ajout et commit
git add .
git commit -m "Description claire des modifications apportées"

# Synchronisation avec la branche principale
git checkout main
git pull origin main
git checkout feature/nom-fonctionnalite
git rebase main

# Pousser les modifications
git push origin feature/nom-fonctionnalite
```

## Configuration des conteneurs Docker

Le projet utilise Docker pour créer un environnement de développement isolé et cohérent.

### Structure des conteneurs

Le projet est divisé en deux services principaux:
- Backend: Service Symfony PHP avec Apache
- Frontend: Application React avec Vite

### Lancement des conteneurs

```bash
# À la racine du projet
docker-compose up -d
```

Le fichier `docker-compose.yml` définit les services suivants:
- `backend`: Service PHP/Symfony avec Apache
- `frontend`: Service Node.js pour React
- `db`: Service MySQL pour la base de données
- `phpmyadmin`: Interface web pour la gestion de la base de données (optionnel)

### Personnalisation des conteneurs

Si nécessaire, vous pouvez modifier les fichiers Dockerfile dans les dossiers `backend/` et `Frontend/` pour adapter les conteneurs à vos besoins spécifiques.

## Configuration de l'environnement Backend (Symfony)

### Installation des dépendances

```bash
# Dans le dossier backend
cd backend
composer install
```

### Configuration de l'environnement

1. Copiez le fichier `.env` en `.env.local` et modifiez les valeurs selon votre environnement:

```bash
cp .env .env.local
```

2. Modifiez les paramètres de base de données dans `.env.local`:

```
DATABASE_URL="mysql://username:password@db:3306/travel_db?serverVersion=8.0"
```

3. Générez les clés JWT:

```bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

### Initialisation de la base de données

```bash
# Création de la base de données
php bin/console doctrine:database:create

# Exécution des migrations
php bin/console doctrine:migrations:migrate

# Chargement des données de test (optionnel)
php bin/console doctrine:fixtures:load
```

### Lancement du serveur de développement

```bash
# Si vous n'utilisez pas Docker
symfony server:start
```

## Configuration de l'environnement Frontend (React)

### Installation des dépendances

```bash
# Dans le dossier Frontend
cd Frontend
npm install
```

### Configuration de l'environnement

1. Copiez le fichier `.env.example` en `.env` si nécessaire:

```bash
cp .env.example .env
```

2. Modifiez les paramètres dans `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Lancement du serveur de développement

```bash
# Si vous n'utilisez pas Docker
npm run dev
```

## Intégration avec les plateformes collaboratives

### Configuration de l'intégration continue (CI/CD)

Le projet utilise GitHub Actions et Jenkins pour l'intégration continue:

- `.github/workflows/backend.yml`: Pipeline CI pour le backend
- `.github/workflows/frontend.yml`: Pipeline CI pour le frontend
- `Jenkinsfile` à la racine et dans les dossiers `backend/` et `Frontend/`: Configuration Jenkins

### Outils collaboratifs

- GitHub pour le versionnement du code
- GitHub Issues pour le suivi des tâches et bugs
- GitHub Pull Requests pour les revues de code

## Sécurisation de l'environnement de développement

### Bonnes pratiques de sécurité

1. Ne jamais commiter de données sensibles (mots de passe, clés API, etc.)
2. Utiliser des variables d'environnement pour les informations sensibles
3. Maintenir les dépendances à jour régulièrement
4. Exécuter les tests de sécurité régulièrement

```bash
# Vérification des vulnérabilités dans les dépendances PHP
composer audit

# Vérification des vulnérabilités dans les dépendances Node.js
npm audit
```

### Script de vérification de sécurité

Exécutez régulièrement le script de vérification de sécurité:

```bash
# À la racine du projet
./security_check.sh
```

### Ressources de sécurité additionnelles

Consultez les documents suivants pour plus d'informations sur la sécurité:
- `ELEMENTS_DE_SECURITE.md`: Principes généraux de sécurité
- `SECURITY_GUIDE.md`: Guide de sécurité détaillé
- `SECURITY_TESTS_SUMMARY.md`: Résumé des tests de sécurité

## Conclusion

Ce guide vous a fourni les informations nécessaires pour configurer votre environnement de développement pour le projet TrevelProject. Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à contacter l'équipe de développement.

En suivant ces instructions, vous disposez maintenant d'un environnement de développement conforme aux standards du projet et prêt à être utilisé pour contribuer au développement de l'application.
