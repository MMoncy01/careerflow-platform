# CareerFlow – AI-Powered Job Application Tracking Platform

CareerFlow is a full-stack job application tracking platform that helps users organize and manage their job search process efficiently. The platform enables users to track applications, recruiter details, interview schedules, follow-up dates, resume versions, and application statuses through a centralized dashboard with AI-powered assistance.

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
- REST APIs
- JWT Authentication

## Database
- PostgreSQL
- Prisma ORM

## AI Integration
- Google Gemini API

## Tools & Technologies
- Docker
- Swagger API Documentation
- Jest
- Git & GitHub

---

# Key Features

## Authentication & Security
- Secure user registration and login
- JWT access-token authentication
- Refresh-token authentication flow
- Protected API routes
- User-specific data isolation

## Job Application Management
- Create, update, delete, and manage job applications
- Track:
  - Company name
  - Job role
  - Application status
  - Recruiter/contact details
  - Resume version
  - Job URL
  - Notes
  - Follow-up dates

## Interview Tracking
- Schedule and manage interviews
- Track interview stages and outcomes
- Update interview details and statuses

## AI-Powered Features
- AI-powered job description analysis using Gemini
- ATS keyword extraction
- Resume tailoring suggestions
- AI-generated recruiter messages
- AI-generated follow-up email drafts
- AI-generated interview questions
- AI-generated project talking points

## Dashboard & Analytics
- Application statistics dashboard
- Response-rate tracking
- Interview-rate tracking
- Offer-rate tracking

## Developer Features
- Swagger API documentation
- Modular frontend/backend architecture
- Docker-based PostgreSQL setup
- Backend test configuration using Jest

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
GEMINI_API_KEY="your_gemini_api_key"
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

## Interviews

```text
POST   /interviews
GET    /interviews
PATCH  /interviews/:id
DELETE /interviews/:id
```

## AI Features

```text
POST /ai/analyze-job
```

---

# Engineering Highlights

- Built a complete full-stack TypeScript application using React and NestJS
- Designed normalized relational database models using Prisma and PostgreSQL
- Implemented JWT authentication with refresh-token flow
- Added per-user ownership and secure access control
- Integrated Gemini AI for job analysis and career-assistance features
- Implemented DTO validation for secure backend input handling
- Created dashboard analytics for tracking job search performance
- Documented APIs using Swagger
- Structured the application using modular frontend/backend architecture

---

# Future Improvements

- Resume file upload and storage
- Cloud deployment
- Real email sending integration
- Expanded automated test coverage
- Calendar integration for interview reminders
- Notification system for follow-ups and interviews

---

# GitHub Repository

Repository Link:

```text
https://github.com/MMoncy01/careerflow-platform
```

---

# License

MIT License
