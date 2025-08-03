# Travel Project Setup Guide

## 🚀 Project Setup Complete!

Your Travel Project has been configured with all dependencies installed and proper configurations set up.

## ✅ What's Been Configured

### Backend (Symfony)
- ✅ All PHP dependencies installed via Composer
- ✅ Database connection configured for local MySQL
- ✅ JWT authentication keys generated
- ✅ Environment variables properly set
- ✅ Namespace issues fixed

### Frontend (React + Vite)
- ✅ All Node.js dependencies installed via npm
- ✅ Environment variables configured
- ✅ API base URL set to backend

## 🗄️ Database Setup

**Important**: You need to start your MySQL server before proceeding.

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script from project root
./setup_database.sh
```

### Option 2: Manual Setup
1. Start MAMP/XAMPP with MySQL on port 8889
2. Create database:
   ```bash
   mysql -h 127.0.0.1 -P 8889 -u root -proot -e "CREATE DATABASE travel_db;"
   ```
3. Import database:
   ```bash
   mysql -h 127.0.0.1 -P 8889 -u root -proot travel_db < travel_db.sql
   ```
4. Run migrations:
   ```bash
   cd backend && php bin/console doctrine:migrations:migrate
   ```

## 🏃‍♂️ Running the Project

### Start Backend (Symfony)
```bash
cd backend
php -S localhost:8000 -t public
```
Backend will be available at: http://localhost:8000

### Start Frontend (React)
```bash
cd frontend_new
npm run dev
```
Frontend will be available at: http://localhost:5177

## 🔧 Configuration Details

### Database Configuration
- **Host**: 127.0.0.1:8889
- **Database**: travel_db
- **Username**: root
- **Password**: root
- **Charset**: utf8mb4

### JWT Configuration
- Private key: `backend/config/jwt/private.pem`
- Public key: `backend/config/jwt/public.pem`
- Passphrase: Auto-generated and configured

### Environment Files
- Backend: `backend/.env`
- Frontend: `frontend_new/.env`

## 🚨 Troubleshooting

### MySQL Connection Issues
1. Ensure MAMP/XAMPP is running
2. Check MySQL is running on port 8889
3. Verify username/password (root/root)

### JWT Issues
If you get JWT errors, regenerate keys:
```bash
cd backend
openssl genpkey -algorithm rsa -out config/jwt/private.pem -aes256 -pass pass:d06bc4ee925cf850340ae40a22950be621c369008798f7313ddb76ad4d230c1a
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:d06bc4ee925cf850340ae40a22950be621c369008798f7313ddb76ad4d230c1a
```

### Cache Issues
Clear Symfony cache:
```bash
cd backend
php bin/console cache:clear
```

## 📁 Project Structure
```
TrevelProject/
├── backend/          # Symfony API backend
├── frontend_new/     # React frontend
├── travel_db.sql     # Database dump
└── setup_database.sh # Database setup script
```

## 🎯 Next Steps
1. Start your MySQL server (MAMP/XAMPP)
2. Run `./setup_database.sh` to set up the database
3. Start the backend: `cd backend && php -S localhost:8000 -t public`
4. Start the frontend: `cd frontend_new && npm run dev`
5. Open http://localhost:5177 in your browser

You're all set! 🎉
