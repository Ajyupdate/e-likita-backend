# e-Likita Backend API

A comprehensive medical consultation platform backend built with NestJS, MongoDB, and TypeScript. This API provides secure, scalable endpoints for managing medical consultations, patient data, and healthcare workflows.

## 🏥 Overview

e-Likita is a guided medical consultation platform that helps patients assess their symptoms and provides appropriate healthcare recommendations through a structured 5-step consultation process. The backend API manages user authentication, patient data, consultation workflows, symptom tracking, and risk assessment.

## ✨ Features

### Core Functionality
- **User Management**: Secure authentication with JWT tokens and role-based access control
- **Patient Management**: Comprehensive patient profiles with medical history and emergency contacts
- **Consultation System**: 5-step guided consultation workflow with progress tracking
- **Symptom Assessment**: Dynamic symptom evaluation with severity tracking
- **Risk Assessment**: Automated risk evaluation based on symptoms and patient data
- **Medical Conditions**: Database of medical conditions with associated symptoms
- **Reference Data**: Comprehensive medical reference information

### Security & Performance
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Built-in throttling to prevent abuse
- **Data Validation**: Comprehensive input validation with class-validator
- **CORS Support**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection middleware
- **Compression**: Response compression for better performance

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, bcryptjs, rate limiting
- **Logging**: Winston logger
- **Language**: TypeScript 5.x

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.module.ts       # Auth module configuration
│   ├── jwt.strategy.ts      # JWT strategy implementation
│   ├── optional-auth.decorator.ts
│   └── optional-auth.guard.ts
├── consultations/          # Consultation management
│   ├── consultations.controller.ts
│   ├── consultations.service.ts
│   ├── consultations.module.ts
│   ├── dto/                # Data transfer objects
│   └── schemas/            # MongoDB schemas
├── patients/               # Patient management
│   ├── patients.controller.ts
│   ├── patients.service.ts
│   ├── patients.module.ts
│   ├── dto/
│   └── schemas/
├── users/                  # User management
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── schemas/
├── symptoms/               # Symptom management
├── medical-conditions/     # Medical conditions database
├── risk/                   # Risk assessment
├── reference/              # Medical reference data
├── app.module.ts           # Main application module
├── main.ts                 # Application bootstrap
└── app.controller.ts       # Root controller
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-likita-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/e-likita
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

The API will be available at `https://e-likita-backend.onrender.com/

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: `https://e-likita-backend.onrender.com/docs`
- **API Endpoints**: `https://e-likita-backend.onrender.com/api`

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Consultations
- `POST /api/consultations` - Create new consultation
- `GET /api/consultations` - Get user consultations
- `GET /api/consultations/:id` - Get specific consultation
- `PUT /api/consultations/:id` - Update consultation

#### Patients
- `POST /api/patients` - Create patient profile
- `GET /api/patients` - Get patient profiles
- `PUT /api/patients/:id` - Update patient profile

#### Symptoms & Medical Data
- `GET /api/symptoms` - Get available symptoms
- `GET /api/medical-conditions` - Get medical conditions
- `GET /api/reference` - Get medical reference data

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start              # Start production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Database Models

#### User Schema
```typescript
{
  email: string;           // Unique email address
  password: string;        // Hashed password
  role: 'patient' | 'doctor' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    address: Address;
  };
}
```

#### Patient Schema
```typescript
{
  userId: ObjectId;        // Reference to User
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string[];
  currentMedications: string[];
  emergencyContact: EmergencyContact;
  address: Address;
}
```

#### Consultation Schema
```typescript
{
  patientId: ObjectId;     // Reference to Patient
  consultationNumber: string; // Unique consultation ID
  status: 'in-progress' | 'completed' | 'cancelled';
  steps: {
    patientInfo: object;
    symptoms: object[];
    followUpAnswers: object;
    riskAssessment: object;
    recommendations: string[];
  };
  completedAt: Date;
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: 100 requests per minute per IP
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: Security headers and XSS protection
- **Input Validation**: Comprehensive request validation
- **Role-based Access**: Different access levels for patients, doctors, and admins

## 🚀 Deployment

### Environment Variables

Required environment variables for production:

```env
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

