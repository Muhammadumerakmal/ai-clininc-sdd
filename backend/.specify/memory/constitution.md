<!--
  Sync Impact Report
  Version change: template (unversioned) → 1.0.0
  Bump type: MAJOR (first real version — complete governance and principle definitions)

  Modified principles: All 6 principles defined from scratch
    - (new) I. Clean Architecture First
    - (new) II. API First Development
    - (new) III. Security by Default
    - (new) IV. AI is an Assistant
    - (new) V. Scalability
    - (new) VI. Maintainability

  Added sections:
    - Technology & Architecture (Section 2)
    - Development & Quality Standards (Section 3)
    - Governance (amendment procedure, versioning, compliance)

  Removed sections: None

  Templates requiring updates:
    - ✅ .specify/templates/plan-template.md — Constitution Check section remains generic; no change needed
    - ✅ .specify/templates/spec-template.md — No constitution-specific references; no change needed
    - ✅ .specify/templates/tasks-template.md — No constitution-specific references; no change needed
    - ✅ .specify/templates/adr-template.md — No constitution-specific references; no change needed
    - ✅ .specify/templates/agent-file-template.md — References constitution.md for code standards; no change needed
    - ✅ .specify/templates/checklist-template.md — No constitution-specific references; no change needed
    - ✅ .specify/templates/phr-template.prompt.md — No constitution-specific references; no change needed
    - ✅ opencode.md — References constitution.md generically; no change needed

  Follow-up TODOs: None
-->

# AI Clinic Management System Backend Constitution

## Core Principles

### I. Clean Architecture First

The system MUST follow a modular architecture with clear separation of
concerns. Each module owns its routes, controllers, services, repositories,
validation, models, and types. Business logic MUST never exist inside routes.
Controllers MUST remain thin. Services contain business logic. Repositories
handle database access.

### II. API First Development

Every feature begins with specification, API design, validation, then
implementation. Endpoints MUST NOT be implemented before they are specified
and documented.

### III. Security by Default

Every endpoint MUST be secure by default requiring authentication,
authorization, validation, sanitization, logging, and error handling. No
sensitive data may be exposed. Passwords MUST never be stored in plain text.

### IV. AI is an Assistant

AI provides recommendations only. AI MUST never automatically diagnose,
prescribe medication, or finalize treatment. Every AI output requires human
review and MUST include a disclaimer indicating it is AI-generated.

### V. Scalability

Every module MUST be independently extendable. The architecture MUST support
future migration to microservices without major refactoring.

### VI. Maintainability

Prefer readability over clever code. Use small reusable functions, services,
middleware, and validation. Avoid duplicated code. Favor named exports and
explicit dependencies.

## Technology & Architecture

### Technology Stack

| Category          | Choice                        |
|-------------------|-------------------------------|
| Runtime           | Node.js 24 LTS                |
| Language          | TypeScript 5                  |
| Framework         | Express.js 5                  |
| Database          | PostgreSQL 17                 |
| ORM               | Prisma ORM                    |
| Authentication    | JWT (Access + Refresh), Google OAuth |
| Validation        | Zod                           |
| Cache             | Redis                         |
| Queue             | BullMQ                        |
| AI                | OpenAI API                    |
| Logging           | Pino                          |
| Documentation     | OpenAPI 3.1, Scalar API Ref   |
| Testing           | Vitest, Supertest             |
| Containerization  | Docker, Docker Compose        |

### Architecture Principles

- Modular Monolith with MVC, Service Layer, and Repository patterns
- REST architecture
- Dependency Injection where appropriate
- Every database table MUST include `id`, `createdAt`, `updatedAt`
- Use foreign keys, transactions, indexes, and constraints
- Avoid duplicate data whenever possible
- Each feature module folder MUST contain: controllers/, routes/, services/,
  repositories/, schemas/, validators/, types/, constants/, utils/

### Authentication & Authorization

- Supported methods: Email & Password, Google OAuth
- Access Token and Refresh Token via HTTP Only Cookies
- Secure Cookies in production
- Role-Based Access Control (RBAC) with roles: Super Admin, Clinic Admin,
  Doctor, Nurse, Receptionist, Lab Technician, Pharmacist, Patient
- Every protected endpoint MUST verify authentication, authorization, and
  permission in that order

### Validation

Every request MUST validate body, params, and query using Zod. Never trust
client input.

### Performance Standards

- Response time <300ms for normal endpoints
- Proper indexing, pagination, lazy loading, and caching where appropriate

## Development & Quality Standards

### Coding Standards

- Use async/await and ES Modules
- Strict TypeScript configuration
- Named exports and reusable utilities
- Avoid nested business logic, large controllers, duplicated code, magic
  numbers, and hardcoded secrets

### API Standards

- Base URL: `/api/v1`
- Every endpoint MUST return a standardized response:

  **Success**: `{ "success": true, "message": "", "data": {} }`

  **Error**: `{ "success": false, "message": "", "errors": [] }`

### Error Handling

Centralized error handling is mandatory. Use custom error classes:

- `ApplicationError`
- `NotFoundError`
- `ValidationError`
- `UnauthorizedError`
- `ForbiddenError`
- `ConflictError`
- `InternalServerError`

Never expose stack traces in production.

### Logging

Every important operation MUST be logged (authentication, appointments,
medical records, billing, AI requests, errors, audit events). Use structured
logging with Pino.

### Testing Requirements

- Unit tests, integration tests, and API tests required
- Critical business logic MUST be tested
- Tests MUST be written using Vitest and Supertest

### Documentation

Every endpoint MUST document:
- Purpose
- Authentication requirements
- Authorization requirements
- Parameters
- Request example
- Response example
- Error responses

### Git Workflow

- Feature branches with pull requests and code reviews
- Conventional Commits
- No direct commits to main

## Governance

This constitution supersedes all other practices and standards. Any
specification, plan, task, or implementation that conflicts with this
constitution MUST be rejected or amended to comply.

### Amendment Procedure

- Amendments MUST be documented with rationale and approved via pull request
- Substantive changes require a migration plan for existing work
- All PRs and reviews MUST verify constitution compliance
- Complexity deviations from principles MUST be justified in the plan's
  Complexity Tracking section
- Versioning follows semantic versioning:
  - MAJOR: Backward incompatible governance or principle changes
  - MINOR: New principle or materially expanded guidance
  - PATCH: Clarifications, wording, typo fixes

### Definition of Done

A feature is complete only if:

- [x] Specification exists
- [x] API documented
- [x] Validation completed
- [x] Business logic implemented
- [x] Tests passing
- [x] Error handling added
- [x] Logging added
- [x] Documentation updated
- [x] Code reviewed

**Version**: 1.0.0 | **Ratified**: 2026-06-30 | **Last Amended**: 2026-06-30
