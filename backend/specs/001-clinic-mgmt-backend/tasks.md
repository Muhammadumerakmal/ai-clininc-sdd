---

description: "Task list for AI Clinic Management System Backend implementation"

---

# Tasks: AI Clinic Management System Backend

**Input**: Design documents from `specs/001-clinic-mgmt-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as OPTIONAL per the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow the modular monolith structure from plan.md: `src/modules/<name>/` for feature modules

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling configuration, and base infrastructure

- [X] T001 Initialize Node.js 24 project with package.json at project root
- [X] T002 [P] Configure TypeScript 5 with strict mode in tsconfig.json
- [X] T003 [P] Configure pnpm as package manager with pnpm-workspace.yaml
- [X] T004 [P] Configure ESLint with TypeScript rules in eslint.config.js
- [X] T005 [P] Configure Prettier formatting in .prettierrc
- [X] T006 [P] Configure Husky git hooks in .husky/
- [X] T007 [P] Configure lint-staged in package.json
- [X] T008 [P] Configure Commitlint with conventional commits in commitlint.config.js
- [X] T009 Create modular folder structure under src/modules/ per plan.md
- [X] T010 [P] Create shared utilities module in src/shared/
- [X] T011 [P] Create configuration module in src/config/
- [X] T012 [P] Create shared types module in src/types/
- [X] T013 Configure environment variables loader in src/config/env.ts with Zod validation
- [X] T014 [P] Create development .env file at project root
- [X] T015 [P] Create production .env.example file at project root
- [X] T016 [P] Install and configure Prisma ORM with PostgreSQL in prisma/schema.prisma
- [X] T017 Create initial Prisma migration for base schema
- [X] T018 Configure database connection in src/config/database.ts
- [X] T019 [P] Configure Pino logger in src/config/logger.ts
- [X] T020 [P] Create centralized error handler middleware in src/middleware/error-handler.ts
- [X] T021 [P] Create standardized API response helper in src/shared/response.ts
- [X] T022 Create health check endpoint at src/modules/health/
- [X] T023 [P] Configure Dockerfile at project root
- [X] T024 [P] Configure Docker Compose with PostgreSQL and Redis in docker-compose.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T025 Create Prisma User model with all fields (id, email, passwordHash, name, role, isVerified, isActive, clinicId, refreshToken, googleId, timestamps)
- [X] T026 [P] Create JWT authentication middleware in src/middleware/auth.ts
- [X] T027 [P] Create RBAC middleware in src/middleware/rbac.ts
- [X] T028 [P] Create permission middleware in src/middleware/permission.ts
- [X] T029 [P] Create Zod validation middleware in src/middleware/validate.ts
- [X] T030 [P] Configure rate limiting middleware in src/middleware/rate-limit.ts
- [X] T031 [P] Configure CORS middleware in src/middleware/cors.ts (in app.ts)
- [X] T032 [P] Configure Helmet security headers in src/middleware/helmet.ts (in app.ts)
- [X] T033 [P] Configure audit logging middleware in src/middleware/audit.ts
- [X] T034 Create Express app entry point in src/app.ts with all middleware registered
- [X] T035 Create server entry point in src/server.ts with graceful shutdown
- [X] T036 Set up API route registration pattern in src/routes/index.ts with /api/v1 prefix

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Authentication & Account Management (Priority: P1) 🎯 MVP

**Goal**: Users can register, verify email, log in with email/password or Google OAuth, reset passwords, and manage their profile.

**Independent Test**: Register a new user → verify email → log in → view profile → log out. Repeat with Google OAuth.

### Implementation for User Story 1

- [X] T037 [P] [US1] Create auth validation schemas in src/modules/auth/validators/auth.schema.ts
- [X] T038 [P] [US1] Create AuthRepository in src/modules/auth/repositories/auth.repository.ts
- [X] T039 [US1] Implement AuthService (register, login, logout, refresh) in src/modules/auth/services/auth.service.ts
- [X] T040 [US1] Create AuthController in src/modules/auth/controllers/auth.controller.ts
- [X] T041 [US1] Create auth routes in src/modules/auth/routes/auth.routes.ts
- [X] T042 [US1] Implement password hashing with bcrypt in src/modules/auth/services/password.service.ts
- [X] T043 [P] [US1] Create email verification token generation in src/modules/auth/services/verification.service.ts
- [X] T044 [US1] Implement email verification endpoint in src/modules/auth/controllers/verification.controller.ts
- [X] T045 [US1] Implement resend verification endpoint
- [X] T046 [P] [US1] Create combined verification service (email verification + password reset) in src/modules/auth/services/verification.service.ts
- [X] T047 [US1] Implement forgot password endpoint
- [X] T048 [US1] Implement reset password endpoint
- [X] T049 [US1] Implement change password endpoint
- [X] T050 [P] [US1] Configure Google OAuth strategy in src/modules/auth/controllers/oauth.controller.ts
- [X] T051 [US1] Implement Google OAuth callback endpoint
- [X] T052 [US1] Implement OAuth account linking for existing users
- [X] T053 [US1] Create admin user management in src/modules/auth/controllers/admin.controller.ts
- [X] T054 [US1] Implement profile service (get/update profile) in src/modules/auth/controllers/profile.controller.ts
- [X] T055 [US1] Create admin and profile routes in src/modules/auth/routes/
- [X] T056 [US1] Add logging for all auth operations (login, register, logout, password changes)
- [X] T057 [US1] Write unit tests for AuthService in tests/unit/modules/auth/auth.service.test.ts
- [X] T058 [US1] Write integration tests for auth endpoints in tests/integration/modules/auth/auth.test.ts

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 — Patient Registration & Appointment Booking (Priority: P2)

**Goal**: Receptionists can register patients with full details and book/reschedule/cancel appointments. Patients can view their own appointments.

**Independent Test**: Register a new patient → book an appointment with an available doctor → verify queue updates → cancel the appointment.

### Implementation for User Story 2

- [X] T059 [P] [US2] Create Prisma Patient model in prisma/schema.prisma
- [X] T060 [P] [US2] Create Prisma Appointment model in prisma/schema.prisma
- [X] T061 Run Prisma migration for Patient and Appointment models
- [X] T062 [P] [US2] Create patient validation schemas in src/modules/patient/validators/patient.schema.ts
- [X] T063 [P] [US2] Create PatientRepository in src/modules/patient/repositories/patient.repository.ts
- [X] T064 [US2] Implement PatientService in src/modules/patient/services/patient.service.ts
- [X] T065 [US2] Create PatientController in src/modules/patient/controllers/patient.controller.ts
- [X] T066 [US2] Create patient routes in src/modules/patient/routes/patient.routes.ts
- [X] T067 [P] [US2] Create appointment validation schemas in src/modules/appointment/validators/appointment.schema.ts
- [X] T068 [P] [US2] Create AppointmentRepository in src/modules/appointment/repositories/appointment.repository.ts
- [X] T069 [US2] Implement AppointmentService in src/modules/appointment/services/appointment.service.ts
- [X] T070 [US2] Implement double-booking prevention in appointment service
- [X] T071 [US2] Create AppointmentController in src/modules/appointment/controllers/appointment.controller.ts
- [X] T072 [US2] Create appointment routes in src/modules/appointment/routes/appointment.routes.ts
- [X] T073 [US2] Implement queue management in appointment service (getQueue)
- [X] T074 [US2] Implement appointment status workflow (scheduled → confirmed → in-progress → completed / cancelled)
- [X] T075 [US2] Add logging for patient and appointment operations
- [X] T076 [US2] Write integration tests for patient registration and appointment booking in tests/integration/modules/appointment/

**Checkpoint**: User Stories 1 AND 2 independently functional

---

## Phase 5: User Story 3 — Clinical Documentation & Prescriptions (Priority: P3)

**Goal**: Doctors can document consultations, record diagnoses, create treatment plans, attach files, and write prescriptions with full medication details.

**Independent Test**: A doctor opens a patient after an appointment → writes consultation notes → adds diagnosis → creates a treatment plan → writes a prescription → patient can view the record and prescription.

### Implementation for User Story 3

- [X] T077 [P] [US3] Create Prisma MedicalRecord model in prisma/schema.prisma
- [X] T078 [P] [US3] Create Prisma Prescription model in prisma/schema.prisma
- [X] T079 Run Prisma migration for MedicalRecord and Prescription models
- [X] T080 [P] [US3] Create medical record validation schemas in src/modules/medical-record/validators/
- [X] T081 [P] [US3] Create MedicalRecordRepository in src/modules/medical-record/repositories/
- [X] T082 [US3] Implement MedicalRecordService in src/modules/medical-record/services/
- [X] T083 [US3] Create MedicalRecordController in src/modules/medical-record/controllers/
- [X] T084 [US3] Create medical record routes in src/modules/medical-record/routes/
- [X] T085 [US3] Implement file attachment handling in src/modules/medical-record/services/attachment.service.ts
- [X] T086 [P] [US3] Create prescription validation schemas in src/modules/prescription/validators/
- [X] T087 [P] [US3] Create PrescriptionRepository in src/modules/prescription/repositories/
- [X] T088 [US3] Implement PrescriptionService in src/modules/prescription/services/
- [X] T089 [US3] Create PrescriptionController in src/modules/prescription/controllers/
- [X] T090 [US3] Create prescription routes in src/modules/prescription/routes/
- [X] T091 [US3] Implement printable prescription format in src/modules/prescription/services/print.service.ts
- [X] T092 [US3] Create patient timeline view in src/modules/patient/services/timeline.service.ts
- [X] T093 [US3] Add logging for medical record and prescription operations
- [X] T094 [US3] Write integration tests for medical records and prescriptions in tests/integration/modules/medical-record/
**Checkpoint**: All 3 user stories independently functional

---

## Phase 6: Extended Clinic Modules

**Purpose**: Doctor management, lab, pharmacy, and billing — supporting modules that build on US2 and US3.

**Independent Test**: Manage a doctor's profile and schedule → order a lab test → dispense a medicine → generate an invoice.

- [X] T095 [P] Create Prisma models for Doctor, DoctorDepartment, LeaveRecord, LabOrder, Medicine, Dispensation, Invoice, Payment
- [X] T096 Run Prisma migration for all extended module models
- [X] T097 [P] Implement Doctor module (profile, qualifications, schedule, leave) in src/modules/doctor/
- [X] T098 [P] Implement Clinic module (CRUD, departments, settings, working hours) in src/modules/clinic/
- [X] T099 [P] Implement Lab module (orders, results, review) in src/modules/lab/
- [X] T100 [P] Implement Pharmacy module (medicine CRUD, dispensations, low-stock alerts) in src/modules/pharmacy/
- [X] T101 [P] Implement Billing module (invoices, payments, discounts, taxes, refunds) in src/modules/billing/
- [X] T102 Implement role-based access enforcement for doctor, lab, pharmacy, and billing operations
- [X] T103 Add logging for doctor, lab, pharmacy, and billing operations
- [X] T104 Write integration tests for extended modules in tests/integration/modules/

**Checkpoint**: All clinical and business modules operational

---

## Phase 7: System Modules

**Purpose**: Notifications, reporting, and AI assistant features.

**Independent Test**: Trigger an appointment reminder → view a revenue report → ask the AI chat a question.

- [X] T105 [P] Create Prisma models for Notification, AuditLog, AIInteraction
- [X] T106 Run Prisma migration for system module models
- [X] T107 [P] Implement Notification module (email, SMS, in-app, appointment reminders) in src/modules/notification/
- [X] T108 [P] Implement Reports module (dashboard, revenue, appointments, doctor, patient) in src/modules/report/
- [X] T109 [P] Implement AI module (chat, symptom analysis, diagnosis suggestions, prescription drafts, medical summaries, follow-up) in src/modules/ai/
- [X] T110 Implement AI disclaimer — every AI response includes AI-generated disclaimer
- [X] T111 Implement doctor approval step before finalizing AI-generated medical output (per FR-046)
- [X] T112 Log all AI interactions via AuditLog (per FR-047)
- [X] T113 Write integration tests for notification delivery and AI endpoints in tests/integration/modules/

**Checkpoint**: All system modules operational

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening, testing coverage, documentation, and deployment readiness.

- [X] T114 [P] Run security audit and fix vulnerabilities (npm audit)
- [X] T115 [P] Write unit tests for all services in tests/unit/
- [X] T116 [P] Write API contract tests for all endpoints in tests/api/
- [X] T117 [P] Write performance tests for critical endpoints in tests/performance/
- [X] T118 [P] Generate OpenAPI 3.1 documentation via Scalar in src/config/docs.ts
- [X] T119 [P] Write README.md at project root
- [X] T120 [P] Write deployment guide in docs/deployment.md
- [X] T121 [P] Write environment configuration guide in docs/environment.md
- [X] T122 [P] Create CI/CD pipeline configuration in .github/workflows/
- [X] T123 [P] Create production Docker Compose override in docker-compose.prod.yml
- [X] T124 Create production environment configuration and release checklist in docs/release-checklist.md
- [X] T125 Run full test suite and fix all failures
- [X] T126 Run quickstart.md validation to ensure setup instructions work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 — Auth & Account Management (Phase 3)**: Depends on Foundational completion
- **US2 — Patient & Appointment (Phase 4)**: Depends on Foundational + US1 (for auth)
- **US3 — Clinical Documentation (Phase 5)**: Depends on Foundational + US2 (for patient/appointment context)
- **Extended Modules (Phase 6)**: Depends on US2 and US3 completion
- **System Modules (Phase 7)**: Depends on Phase 6 completion
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Requires US1 authentication for protected endpoints, but testable with seeded tokens
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Requires US2's patient/appointment context, but testable with seeded data

### Within Each User Story

- Models before services
- Services before controllers
- Controllers before routes
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tasks within a phase marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all validation schemas together:
Task: "T037 [P] [US1] Create auth validation schemas in src/modules/auth/validators/auth.schema.ts"
Task: "T038 [P] [US1] Create AuthRepository in src/modules/auth/repositories/auth.repository.ts"

# Launch all services (after repositories complete):
Task: "T039 [US1] Implement AuthService in src/modules/auth/services/auth.service.ts"
Task: "T046 [P] [US1] Create password reset token generation in src/modules/auth/services/password-reset.service.ts"
```

## Parallel Example: User Story 2

```bash
# Launch all models together:
Task: "T059 [P] [US2] Create Prisma Patient model in prisma/schema.prisma"
Task: "T060 [P] [US2] Create Prisma Appointment model in prisma/schema.prisma"

# Launch all repositories together:
Task: "T063 [P] [US2] Create PatientRepository in src/modules/patient/repositories/patient.repository.ts"
Task: "T068 [P] [US2] Create AppointmentRepository in src/modules/appointment/repositories/appointment.repository.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Auth & Account Management)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Patient & Appointment) → Test independently → Deploy/Demo
4. Add User Story 3 (Clinical Documentation) → Test independently → Deploy/Demo
5. Add Extended Modules (Doctor, Lab, Pharmacy, Billing) → Deploy/Demo
6. Add System Modules (Notifications, Reports, AI) → Deploy/Demo
7. Polish → Production Release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Auth)
   - Developer B: User Story 2 (Patient & Appointment)
   - Developer C: User Story 3 (Clinical Documentation)
3. Each developer extends their module with supporting features
4. Team reconvenes for Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All paths under `src/` unless explicitly noted as `tests/`
