---
id: 4
title: clinic mgmt backend analyze
stage: explainer
date: 2026-06-30
surface: agent
model: opencode/deepseek-v4-flash-free
feature: 001-clinic-mgmt-backend
branch: 001-clinic-mgmt-backend
user: cli
command: /sp.analyze
labels: ["analyze", "audit", "cross-artifact"]
links:
  spec: specs/001-clinic-mgmt-backend/spec.md (conversation only)
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md (read)
  - specs/001-clinic-mgmt-backend/tasks.md (read)
tests:
  - Cross-artifact analysis — 11 findings identified (1 critical, 1 high, 4 medium, 5 low)
---

## Prompt

```text
# AI Clinic Management System Backend Analysis Report

[Full analysis report — 9 sections covering artifact alignment, requirements, technology, architecture, security, AI, DB, risks, recommendations]
```

## Response snapshot

Executed `/sp.analyze` — cross-artifact consistency analysis:

1. **Loaded artifacts**: constitution.md (disk) ✅, tasks.md (disk) ✅, spec.md (conversation context only) ⚠️, plan.md (conversation context only) ⚠️
2. **Built semantic models**: 47 FRs from spec, 6 principles from constitution, 126 tasks from tasks.md
3. **Detection passes**: 11 findings total
   - A1 (CRITICAL): spec.md/plan.md not on disk — must commit before implementation
   - A9 (HIGH): data-model.md and contracts/ referenced but missing
   - A2,A6,A7,A8 (MEDIUM): package manager missing, no token rotation, no account lockout, endpoint docs not explicitly tasked
   - A3,A4,A5,A10,A11 (LOW): bcrypt vs constitution, vague security audit, no coverage targets, performance not verified, Prisma migration ordering
4. **Coverage**: 100% (47/47 FRs have ≥1 task)
5. **Constitution alignment**: All 6 principles satisfied
6. **Report delivered** with next actions and offer for remediation

## Outcome

- ✅ Impact: Read-only analysis completed — 11 findings documented
- 🧪 Tests: Cross-artifact consistency verified — 100% requirement coverage; 0 constitution violations
- 📁 Files: No files modified (read-only analysis)
- 🔁 Next prompts: Resolve A1 (commit artifacts), then proceed to `/sp.implement`
- 🧠 Reflection: spec.md and plan.md loss from disk is the main blocker; conversation history provides full content for recreation

## Evaluation notes (flywheel)

- Failure modes observed: check-prerequisites.ps1 failed (git branch mismatch) — proceeded with available artifacts + conversation context
- Graders run and results (PASS/FAIL): N/A (analysis, not test suite)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Resolve A1 by committing spec and plan to disk
