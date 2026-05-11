# CareerFlow – Job Application Tracking Platform

CareerFlow is a full-stack job application tracking platform designed to help users manage and organize their job search process efficiently. The platform allows users to track applications, recruiter details, interview stages, follow-up dates, resume versions, and application statuses through a centralized dashboard.

---

# Tech Stack

## Frontend
- React 19
- TypeScript
- Vite
- React Router

## Backend
- NestJS
- TypeScript
- REST API
- JWT Authentication

## Database
- PostgreSQL
- Prisma ORM

## Tools & Technologies
- Docker
- Swagger API Documentation
- Git & GitHub

---

# Key Features

- Secure user authentication and authorization
- JWT access token authentication with refresh-token flow
- Create, update, delete, and manage job applications
- Track:
  - Company name
  - Job role
  - Application status
  - Recruiter details
  - Resume version
  - Job URL
  - Notes
  - Follow-up dates
- Dashboard analytics and application statistics
- Protected API routes
- Swagger API documentation
- Modular frontend/backend architecture

---

# Architecture

```text
React Frontend (Vite)
        ↓
NestJS REST API
        ↓
Prisma ORM
        ↓
PostgreSQL Database
```

---

# Project Structure

```text
careerflow-platform/
├── apps/
│   ├── api/        # NestJS backend
│   └── web/        # React frontend
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/MMoncy01/careerflow-platform.git
cd careerflow-platform
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start PostgreSQL with Docker

```bash
docker compose up -d
```

Docker database credentials:

```env
POSTGRES_USER=careerflow
POSTGRES_PASSWORD=careerflow_pw
POSTGRES_DB=careerflow_db
```

---

## 4. Configure Environment Variables

Create a `.env` file inside:

```text
apps/api/
```

Add:

```env
DATABASE_URL="postgresql://careerflow:careerflow_pw@localhost:5432/careerflow_db"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
PORT=3000
```

---

## 5. Run Prisma Migration

```bash
cd apps/api

npx prisma migrate dev
npx prisma generate
```

---

## 6. Start Backend Server

```bash
npm run start:dev
```

Backend runs at:

```text
http://localhost:3000
```

Swagger API Documentation:

```text
http://localhost:3000/docs
```

---

## 7. Start Frontend

Open another terminal:

```bash
cd apps/web

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Core API Endpoints

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

## Applications

```text
POST   /applications
GET    /applications
GET    /applications/stats
PATCH  /applications/:id
DELETE /applications/:id
```

---

# Engineering Highlights

- Built a complete full-stack TypeScript application
- Implemented JWT authentication and protected APIs
- Designed normalized relational database models using Prisma and PostgreSQL
- Added per-user application ownership and data isolation
- Implemented DTO validation for safer backend input handling
- Created analytics logic for tracking application success metrics
- Documented APIs using Swagger
- Structured the application using modular frontend and backend architecture

---

# Future Improvements

- Resume upload and management
- AI-powered job description summarization
- Interview scheduling tracker
- Email follow-up automation
- Cloud deployment
- Automated test coverage

---

# GitHub Repository

Repository Link:

```text
https://github.com/MMoncy01/careerflow-platform
```

---

# License

MIT License
