---
id: PHR-001-005
title: fix-code-quality-issues
stage: refactor
date: 2026-07-02
surface: cli
model: opencode/deepseek-v4-flash-free
feature: 001-clinic-mgmt-backend
branch: main
user: developer
command: /sp.implement
labels: [refactor, lint, typescript, cleanup]
links:
  spec: specs/001-clinic-mgmt-backend/tasks.md
  ticket: ""
  adr: ""
  pr: ""
files:
  - src/middleware/auth.ts
  - src/middleware/error-handler.ts
  - src/models/Doctor.ts
  - src/models/MedicalRecord.ts
  - src/models/Patient.ts
  - src/models/Prescription.ts
  - src/modules/auth/services/token.service.ts
  - src/modules/clinic/services/clinic.service.ts
  - src/modules/appointment/services/appointment.service.ts
  - src/modules/lab/services/lab.service.ts
  - src/modules/pharmacy/services/pharmacy.service.ts
  - src/modules/prescription/services/prescription.service.ts
  - pnpm-workspace.yaml
tests:
  - tests/unit/modules/auth/auth.service.test.ts
  - tests/unit/shared/response.test.ts
  - tests/integration/modules/auth/auth.test.ts
  - tests/integration/modules/patient/patient.test.ts
  - tests/integration/modules/appointment/appointment.test.ts
  - tests/integration/modules/medical-record/medical-record.test.ts
  - tests/integration/modules/lab/lab.test.ts
  - tests/api/contract.test.ts
---

## Prompt

The user invoked `/sp.implement` without specifying a specific task. Investigation revealed that all 126 tasks in `specs/001-clinic-mgmt-backend/tasks.md` were already marked complete [X]. The project was fully implemented with TypeScript compiling and all 30 tests passing. However, there was 1 ESLint error (namespace usage in auth middleware) and 19 `@typescript-eslint/no-explicit-any` warnings across the codebase. The task was to clean up these code quality issues while preserving all existing functionality.

## Response snapshot

Fixed the namespace lint error in `src/middleware/auth.ts` by replacing `declare global { namespace Express { ... } }` with `declare module "express" { ... }`. Removed unnecessary `as any` casts from 7 service files where `Record<string, unknown>` was already compatible with repository method signatures. Added eslint-disable comments with explanations for 5 remaining cases where `any` is required due to Mongoose `Schema.Types.Mixed` array typing limitations and JWT `SignOptions.expiresIn` type string incompatibility. Fixed `pnpm-workspace.yaml` allowBuilds placeholder values. All builds, lint, and tests pass with 0 errors and 0 warnings.

## Outcome

- ✅ Impact: 0 ESLint errors, 0 warnings; TypeScript strict mode clean compilation; all 30 tests pass across 8 test suites; the codebase is fully production-ready with no lint or type issues.
- 🧪 Tests: 30 tests passing (8 test files)
- 📁 Files: 13 files modified (6 src module files, 4 model files, 1 config file, 1 middleware file, 1 workspace config)
- 🔁 Next prompts: No blockers — the project is clean and ready for next task instruction.
- 🧠 Reflection: The `any` type warnings were concentrated in two categories: (1) Mongoose `Schema.Types.Mixed` array definitions, where Mongoose's complex generic types make proper typing impractical without `any` — these are best handled with targeted eslint-disable comments; (2) unnecessary `as any` casts in service layer where `Record<string, unknown>` was already type-compatible — these were safely removed.

## Evaluation notes (flywheel)

- Failure modes observed: Removing `as any` from Mongoose model files caused TypeScript compilation errors due to Mongoose's complex generic type inference for `Schema.Types.Mixed` arrays. The correct approach was to re-add `as any` with eslint-disable comments rather than fighting Mongoose's type system.
- Graders run and results (PASS/FAIL): PASS — lint (0 errors, 0 warnings), build (tsc, 0 errors), tests (30/30 pass)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
