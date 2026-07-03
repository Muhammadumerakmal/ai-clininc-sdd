# AI Clinic Management System Backend

A modular monolith backend for managing clinic operations: patient registration, appointment booking, clinical documentation, prescriptions, lab orders, pharmacy, billing, notifications, and AI-assisted workflows.

## Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript 5 (strict mode)
- **Framework**: Express.js 5
- **Database**: MongoDB via Mongoose ODM
- **Auth**: JWT (access + refresh tokens), Google OAuth
- **AI**: OpenAI GPT-4o-mini (chat, symptom analysis, diagnosis suggestions, prescription drafts)
- **Vector DB**: Qdrant (for semantic search)
- **Email**: Mailtrap (dev), SMTP (production)
- **File Storage**: Cloudinary
- **Logging**: Pino
- **Testing**: Vitest + Supertest

## Prerequisites

- Node.js >= 22
- MongoDB (local or Atlas)
- Redis (for BullMQ queues)
- npm

## Quick Start

```bash
# Clone and install
git clone <repo>
cd ai-clinic-mgmt-backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start MongoDB and Redis
docker compose up -d

# Run in development
npm run dev
```

The server starts at `http://localhost:8000`.

## API Endpoints

| Prefix | Module | Auth Required |
|--------|--------|:---:|
| `/api/v1/health` | Health check | No |
| `/api/v1/auth` | Authentication | Varies |
| `/api/v1/patients` | Patient management | Yes |
| `/api/v1/appointments` | Appointment booking | Yes |
| `/api/v1/medical-records` | Clinical documentation | Yes |
| `/api/v1/prescriptions` | Prescriptions | Yes |
| `/api/v1/lab-orders` | Lab test orders | Yes |
| `/api/v1/pharmacy` | Medicine inventory & dispensing | Yes |
| `/api/v1/doctors` | Doctor profiles & leave | Yes |
| `/api/v1/clinics` | Clinic & department management | Yes |
| `/api/v1/billing` | Invoices & payments | Yes |
| `/api/v1/notifications` | In-app notifications | Yes |
| `/api/v1/reports` | Dashboard & reports | Yes |
| `/api/v1/ai` | AI assistant features | Yes |

## Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login (returns JWT) |
| POST | `/api/v1/auth/google` | Google OAuth login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/verify-email` | Verify email |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |
| GET | `/api/v1/auth/profile` | Get profile |
| PUT | `/api/v1/auth/profile` | Update profile |
| PUT | `/api/v1/auth/profile/password` | Change password |
| GET | `/api/v1/auth/admin/users` | List users (admin) |
| POST | `/api/v1/auth/admin/users` | Create user (admin) |

## Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses use the same structure with `success: false`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:int` | Run integration tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── config/          # env, logger, database, qdrant
├── middleware/       # auth, rbac, validation, rate-limit, audit
├── models/          # Mongoose schemas (19 models)
├── modules/         # Feature modules
│   ├── auth/        # Authentication & user management
│   ├── patient/     # Patient registration
│   ├── appointment/ # Appointment booking
│   ├── medical-record/ # Clinical documentation
│   ├── prescription/   # Prescriptions
│   ├── lab/         # Lab orders
│   ├── pharmacy/    # Medicine inventory & dispensing
│   ├── doctor/      # Doctor profiles & leave
│   ├── clinic/      # Clinic & departments
│   ├── billing/     # Invoices & payments
│   ├── notification/ # In-app notifications
│   ├── reports/     # Dashboard & analytics
│   ├── ai/          # AI assistant
│   └── health/      # Health check
├── routes/          # Route registration
├── shared/          # Response helpers, errors, attachment service
├── app.ts           # Express app entry
└── server.ts        # Server entry
```

## License

MIT
