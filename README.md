# TrevelProject

A comprehensive travel planning and management application built with Symfony 7.2 backend and React 18 frontend.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installation](#installation)
- [Running the Application](#-running-the-application)
  - [Development Mode](#development-mode)
  - [Docker Deployment](#docker-deployment)
- [Project Structure](#-project-structure)
- [Security Implementation](#-security-implementation)
- [Testing](#-testing)
- [Deployment](#-deployment)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Production Deployment](#production-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🌍 Project Overview

TrevelProject is a full-featured travel planning application designed to help users plan, organize, and manage their trips efficiently. The application allows travelers to create detailed itineraries, discover points of interest, manage travel items, check weather forecasts, and visualize their routes on interactive maps.

The project is built with a modern tech stack using Symfony 7.2 for the backend API and React 18 with Vite for the frontend. It implements secure user authentication with JWT, RESTful API architecture, and follows best practices in both development and deployment.

## ✨ Features

- **User Authentication & Authorization**
  - Secure registration and login system
  - JWT-based authentication
  - Password reset functionality
  - Role-based access control

- **Trip Management**
  - Create and manage trip itineraries
  - Add/edit locations and points of interest
  - Track trip items and packing lists
  - View detailed trip information

- **Map & Route Visualization**
  - Interactive maps using Leaflet
  - Route planning and optimization
  - Points of interest visualization

- **Weather Integration**
  - Current weather conditions
  - Weather forecasts for travel destinations

- **Administrative Features**
  - User management dashboard
  - Content moderation tools
  - System analytics

- **SEO Optimization**
  - Dynamic meta tags
  - Sitemap generation
  - Structured data for better indexing

## 🛠 Technology Stack

### Backend
- **Framework**: Symfony 7.2
- **Database**: MySQL 8.0
- **Authentication**: Lexik JWT
- **API**: RESTful with proper versioning
- **Security**: Nelmio Security Bundle
- **Rate Limiting**: Symfony Rate Limiter

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Maps**: Leaflet/React Leaflet
- **Testing**: Vitest with Testing Library

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions & Jenkins
- **Orchestration**: Docker Compose
- **Version Control**: Git with GitHub

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- Git
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn
- MySQL 8.0
- Docker and Docker Compose (for containerized deployment)

### Cloning the Repository

```bash
# Clone the main repository
git clone https://github.com/katekate7/TrevelProject.git

# Navigate to the project directory
cd TrevelProject

# Initialize and update the frontend submodule
git submodule update --init --recursive
```

### Installation

#### Option 1: Manual Setup

1. **Set up the backend**:
```bash
cd backend

# Install PHP dependencies
composer install

# Configure environment variables
cp .env.dev .env.local

# Generate JWT keys
mkdir -p config/jwt
openssl genpkey -algorithm rsa -out config/jwt/private.pem -aes256 -pass pass:your_passphrase
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:your_passphrase

# Update .env.local with JWT passphrase
# JWT_PASSPHRASE=your_passphrase
```

2. **Set up the database**:
```bash
# Run the database setup script
./setup_database.sh

# Or manually setup:
mysql -h 127.0.0.1 -P 3306 -u root -proot -e "CREATE DATABASE travel_db;"
mysql -h 127.0.0.1 -P 3306 -u root -proot travel_db < travel_db.sql
cd backend && php bin/console doctrine:migrations:migrate
```

3. **Set up the frontend**:
```bash
cd Frontend

# Install Node dependencies
npm install

# Configure environment variables
cp .env.example .env
```

#### Option 2: Using Setup Script

The project includes a setup script that automates most of the configuration:

```bash
# Make the script executable
chmod +x setup_database.sh

# Run the setup script
./setup_database.sh
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**:
```bash
# Using the convenience script
./start_backend.sh

# Or manually:
cd backend
php -S localhost:8000 -t public
```

2. **Start the frontend development server**:
```bash
# Using the convenience script
./start_frontend.sh

# Or manually:
cd Frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5177
- Backend API: http://localhost:8000

### Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

With Docker, the application will be available at:
- Frontend: http://localhost:5177
- Backend API: http://localhost:8000
- PHPMyAdmin: http://localhost:8090 (credentials: root/root)

## 📂 Project Structure

```
TrevelProject/
├── README.md                   # Project documentation
├── SETUP_GUIDE.md              # Detailed setup guide
├── DEVOPS_DEPLOYMENT.md        # DevOps and deployment documentation
├── SECURITY_GUIDE.md           # Security implementation guide
├── docker-compose.yml          # Docker services configuration
├── setup_database.sh           # Database setup script
├── start_backend.sh            # Backend startup script
├── start_frontend.sh           # Frontend startup script
├── backend/                    # Symfony backend application
│   ├── src/
│   │   ├── Controller/         # API controllers
│   │   ├── Entity/             # Database entities
│   │   ├── Repository/         # Data repositories
│   │   ├── Security/           # Security components
│   │   └── Service/            # Business logic services
│   ├── config/                 # Application configuration
│   ├── tests/                  # Backend tests
│   └── ...
└── Frontend/                   # React frontend application
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Application pages
    │   ├── layouts/            # Page layouts
    │   ├── api.js              # API client configuration
    │   └── ...
    ├── tests/                  # Frontend tests
    └── ...
```

## 🔒 Security Implementation

TrevelProject implements comprehensive security measures:

- **Authentication**: JWT-based with secure token handling
- **Authorization**: Role-based access control
- **Data Protection**: HTTPS, input validation, and output escaping
- **API Security**: Rate limiting, CORS configuration
- **Headers Security**: Content-Security-Policy, X-Frame-Options
- **Database**: Parameterized queries, secure connections
- **Regular Security Checks**: Using security_check.sh script

For more details, refer to the [Security Guide](SECURITY_GUIDE.md).

## 🧪 Testing

### Backend Testing

```bash
cd backend
php bin/phpunit
```

### Frontend Testing

```bash
cd Frontend
npm run test
```

For more information on testing strategies and test coverage, see [Testing Guide](TESTING_GUIDE.md).

## 📦 Deployment

### CI/CD Pipeline

The project utilizes GitHub Actions for continuous integration and deployment:

- **Backend**: `.github/workflows/backend.yml`
- **Frontend**: `.github/workflows/frontend.yml`

Alternative Jenkins pipelines are also provided in the Jenkinsfile at the root directory and in each component folder.

### Production Deployment

For production deployment, follow these steps:

1. **Environment Setup**:
   - Configure production environment variables
   - Set up production database with proper credentials
   - Configure web server (Nginx/Apache) with SSL

2. **Build Process**:
   ```bash
   # Backend
   cd backend
   APP_ENV=prod APP_DEBUG=0 composer install --no-dev --optimize-autoloader
   
   # Frontend
   cd Frontend
   npm run build
   ```

3. **Deployment**:
   - Deploy using Docker:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
   
   - Or deploy manually by copying built assets to your server

For comprehensive deployment instructions, refer to [DevOps Deployment Guide](DEVOPS_DEPLOYMENT.md).

## 👥 Contributing

We welcome contributions to the TrevelProject! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔧 Troubleshooting

### MySQL Connection Issues
1. Ensure MySQL is running on the correct port (default: 3306 or 8889 for MAMP)
2. Verify username/password (default: root/root)
3. Check that the travel_db database exists

### JWT Issues
If you encounter JWT authentication errors:
```bash
cd backend
openssl genpkey -algorithm rsa -out config/jwt/private.pem -aes256 -pass pass:your_passphrase
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:your_passphrase
```
Then update your JWT_PASSPHRASE in .env.local

### Cache Issues
Clear Symfony cache:
```bash
cd backend
php bin/console cache:clear
```

## 📄 License

This project is proprietary and confidential. All rights reserved.