</> Markdown

# CareerFlow – Intelligent Job Application Tracking Platform

CareerFlow is a production-style full-stack web application built to help job seekers manage, monitor, and optimize their complete job search workflow in one centralized platform.

Unlike a traditional spreadsheet tracker, CareerFlow provides:

- secure user authentication
- private job application management
- recruiter/contact tracking
- follow-up reminders
- application analytics dashboard
- status-based workflow updates
- searchable job history
- performance insights

The platform is designed to simulate a real-world SaaS productivity product using a modern enterprise-grade full-stack architecture.

---

## Live Project Purpose

CareerFlow solves a common problem faced by active job seekers:

> Managing dozens of job applications, recruiter conversations, resume versions, and follow-up deadlines becomes chaotic in spreadsheets and scattered notes.

CareerFlow centralizes that process into one secure workflow-driven application.

Users can:

- register/login securely
- create and manage detailed job applications
- track recruiter contact details
- save resume version used for each role
- attach job links and descriptions
- monitor follow-up deadlines
- analyze response/interview/offer rates
- search and filter applications instantly
- update application statuses dynamically

---

## Key Features Implemented

### Authentication & Security

- JWT based secure authentication
- HTTP-only refresh token cookie flow
- protected private routes
- per-user application ownership isolation

### Career Dashboard Analytics

- total applications tracked
- weekly application count
- response rate %
- interview conversion %
- offer conversion %
- recent applications panel
- follow-up due reminders

### Advanced Application Tracking

Each application record supports:

- Company Name
- Role / Position
- Application Status
- Job Location
- Job Posting URL
- Source (LinkedIn / Referral / Company Site / etc.)
- Recruiter Name
- Recruiter Email
- Resume Version Used
- Job Description
- Applied Date
- Follow-Up Date
- Private Notes
- Last Activity Timestamp

### Workflow Productivity

- quick status updates
- search by company / role / recruiter
- filter by status
- delete applications
- automatic stale/follow-up detection logic

### API Documentation

- fully documented Swagger API available at `/docs`

---

## Full Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Context API Authentication State

### Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication
- Cookie-based refresh token workflow
- REST API architecture

### Database

- PostgreSQL

### DevOps / Version Control

- Git
- GitHub
- Incremental feature milestone commits

---

## System Architecture

```text
React Frontend (Vite)
        ↓
NestJS REST API
        ↓
Prisma ORM Service Layer
        ↓
PostgreSQL Database

Authentication Flow:

Register/Login → JWT Access Token + Refresh Cookie
        ↓
Protected API Requests
        ↓
Per-user private data access
Main Screens Included
Home Page
Register Page
Login Page
Analytics Dashboard
Applications Management Workspace
Protected 404 Routing
Swagger API Docs
Sample Product Screenshots

Local Development Setup
</> Bash
1. Clone repository
git clone https://github.com/MMoncy01/careerflow-platform.git
cd careerflow-platform
2. Install dependencies
</> Bash
npm install
3. Start PostgreSQL (Docker)
</> Bash
docker compose up -d
4. Run Prisma migrations
</> Bash
cd apps/api
npx prisma migrate dev
npx prisma generate
5. Start Backend API
</> Bash
npm run start:dev

Backend runs on:
http://localhost:3000

Swagger Docs:
http://localhost:3000/docs

6. Start Frontend

Open new terminal:
</> Bash
cd apps/web
npm run dev

Frontend runs on:
http://localhost:5173

Core REST Endpoints
Auth
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /auth/me
Applications
POST /applications
GET /applications
GET /applications/stats
PATCH /applications/:id
DELETE /applications/:id
Engineering Highlights

This project demonstrates:

scalable frontend/backend separation
protected enterprise authentication workflow
relational data ownership modeling
advanced DTO validation
analytics aggregation logic
production-style REST architecture
real-world CRUD + search + workflow management
Planned Next Enhancements
AI job description summarizer
recruiter follow-up email generator
interview tracker module
document/resume manager
cloud deployment
Repository Status

Actively being enhanced as a production-grade portfolio project.
```
