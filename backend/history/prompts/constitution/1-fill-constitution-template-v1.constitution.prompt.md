---
id: 1
title: fill constitution template v1
stage: constitution
date: 2026-06-30
surface: agent
model: opencode/deepseek-v4-flash-free
feature: none
branch: master
user: cli
command: direct message
labels: ["constitution", "governance", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - constitution.md validated — no remaining bracket tokens
---

## Prompt

```text
# AI Clinic Management System Backend Constitution

Version: 1.0.0
Status: Active
Project Type: Backend API
Architecture: Modular Monolith
Last Updated: June 30, 2026

---

# Purpose

This constitution defines the mandatory engineering principles, architecture decisions, coding standards, security requirements, and development practices for the AI Clinic Management System Backend.

Every specification, implementation plan, task, and code change MUST comply with this constitution.

---

# Core Principles

## 1. Clean Architecture First

The system must follow a modular architecture with clear separation of concerns.

Each module owns its:

- Routes
- Controllers
- Services
- Repositories
- Validation
- Models
- Types

Business logic must never exist inside routes.

Controllers must remain thin.

Services contain business logic.

Repositories handle database access.

---

## 2. API First Development

Every feature begins with:

Specification
↓

API Design
↓

Validation
↓

Implementation

Never implement endpoints before they are specified.

---

## 3. Security by Default

Every endpoint must be secure by default.

Required:

- Authentication
- Authorization
- Validation
- Sanitization
- Logging
- Error Handling

No sensitive data may be exposed.

Passwords are never stored in plain text.

---

## 4. AI is an Assistant

Artificial Intelligence provides recommendations only.

AI must never automatically:

- diagnose
- prescribe medication
- finalize treatment

Every AI output requires human review.

---

## 5. Scalability

Every module must be independently extendable.

The architecture should support future migration into microservices without major refactoring.

---

## 6. Maintainability

Prefer readability over clever code.

Small reusable functions.

Reusable services.

Reusable middleware.

Reusable validation.

Avoid duplicated code.

---

# Technology Stack

## Runtime

Node.js 24 LTS

## Language

TypeScript 5

## Framework

Express.js 5

## Database

PostgreSQL 17

## ORM

Prisma ORM

## Authentication

JWT Access Token

JWT Refresh Token

Google OAuth

## Validation

Zod

## Cache

Redis

## Queue

BullMQ

## AI

OpenAI API

## Logging

Pino

## Documentation

OpenAPI 3.1

Scalar API Reference

## Testing

Vitest

Supertest

## Containerization

Docker

Docker Compose

---

# Architecture Principles

The application uses:

- Modular Monolith
- MVC Pattern
- Service Layer Pattern
- Repository Pattern
- REST Architecture
- Dependency Injection where appropriate

---

# Folder Structure Rules

Every feature module must contain:

controllers/

routes/

services/

repositories/

schemas/

validators/

types/

constants/

utils/

---

# Coding Standards

Use:

- async/await
- ES Modules
- strict TypeScript
- named exports
- reusable utilities

Avoid:

- nested business logic
- large controllers
- duplicated code
- magic numbers
- hardcoded secrets

---

# API Standards

Base URL

/api/v1

Every endpoint must return a standardized response.

Example Success

{
  "success": true,
  "message": "",
  "data": {}
}

Example Error

{
  "success": false,
  "message": "",
  "errors": []
}

---

# Authentication Standards

Supported Authentication:

- Email & Password
- Google OAuth

Tokens

Access Token

Refresh Token

HTTP Only Cookies

Secure Cookies in Production

---

# Authorization

Role-Based Access Control (RBAC)

System Roles:

- Super Admin
- Clinic Admin
- Doctor
- Nurse
- Receptionist
- Lab Technician
- Pharmacist
- Patient

Every protected endpoint must verify:

Authentication

↓

Authorization

↓

Permission

---

# Database Principles

Use PostgreSQL.

Use Prisma ORM.

Every table must include:

- id
- createdAt
- updatedAt

Use:

- Foreign Keys
- Transactions
- Indexes
- Constraints

Avoid duplicate data whenever possible.

---

# Validation

Every request must validate:

- Body
- Params
- Query

Validation library:

Zod

Never trust client input.

---

# Error Handling

Centralized error handling is mandatory.

Use custom:

ApplicationError

NotFoundError

ValidationError

UnauthorizedError

ForbiddenError

ConflictError

InternalServerError

Never expose stack traces in production.

---

# Logging

Every important operation should be logged.

Examples:

Authentication

Appointments

Medical Records

Billing

AI Requests

Errors

Audit Events

Use structured logging with Pino.

---

# AI Principles

AI can assist with:

- Symptom Analysis
- Medical Summaries
- Appointment Suggestions
- Prescription Drafts
- Follow-up Recommendations

AI must never replace licensed medical professionals.

Every AI response must include a disclaimer indicating that it is AI-generated.

---

# Testing Requirements

Required:

Unit Tests

Integration Tests

API Tests

Critical business logic must be tested.

---

# Performance Standards

Response Time

< 300ms for normal endpoints

Database

Proper indexing

Pagination

Lazy loading

Caching where appropriate

---

# Documentation

Every endpoint must include:

Purpose

Authentication

Authorization

Parameters

Request Example

Response Example

Error Responses

---

# Git Workflow

Feature Branches

Pull Requests

Code Reviews

Conventional Commits

No direct commits to main.

---

# Definition of Done

A feature is complete only if:

✓ Specification exists

✓ API documented

✓ Validation completed

✓ Business logic implemented

✓ Tests passing

✓ Error handling added

✓ Logging added

✓ Documentation updated

✓ Code reviewed

---

# Constitutional Rule

If any specification, plan, task, or implementation conflicts with this constitution, this constitution takes precedence.

Every future SDD artifact must follow these principles. 
```

**You **MUST** consider the user input before proceeding (if not empty).**

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

[Additional outline instructions...]
```

## Response snapshot

Filled the `.specify/memory/constitution.md` template with the full AI Clinic Management System Backend Constitution:

- Replaced all 21 placeholder tokens with concrete values derived from user input
- Mapped 6 user-provided principles to template slots (I–VI)
- Organized remaining content into Technology & Architecture (Section 2) and Development & Quality Standards (Section 3)
- Defined Governance rules with amendment procedure, versioning policy, and Definition of Done
- Set version 1.0.0 (MAJOR bump — first real version)
- Dates: Ratified 2026-06-30, Last Amended 2026-06-30
- Conducted consistency propagation check across 8 templates/docs — all ✅ no changes needed
- Validated no remaining bracket placeholder tokens remain
- Prepended Sync Impact Report as HTML comment at top of file

## Outcome

- ✅ Impact: Project constitution defined from generic template; governs all future SDD artifacts
- 🧪 Tests: Constitution file validated — zero remaining bracket tokens
- 📁 Files: .specify/memory/constitution.md (updated), history/prompts/constitution/1-fill-constitution-template-v1.constitution.prompt.md (created)
- 🔁 Next prompts: None
- 🧠 Reflection: Template had a minor structural quirk (PRINCIPLE__DESCRIPTION double underscore on line 34) which was correctly mapped as Principle 6 description

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Placeholder grep PASS — no bracket tokens remain except intentional markdown (`[x]` checkboxes, `[]` JSON)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
