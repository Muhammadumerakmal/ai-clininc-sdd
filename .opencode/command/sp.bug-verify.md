---
description: Verify bug fixes by running type checks, lint, tests, and regression analysis to confirm no regressions.
handoffs:
  - label: Detect Bugs
    agent: sp.bug-detect
    prompt: Scan for remaining bugs after verification
  - label: Fix Bug
    agent: sp.bug-fix
    prompt: Fix bugs that failed verification
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

`$ARGUMENTS` may contain specific fix IDs (e.g., `BUG-001 BUG-003`) or a diff reference (e.g., `HEAD~1`). If empty, verify the latest changes.

## Goal

Confirm that bug fixes resolve the original issue without introducing regressions. Provide a pass/fail verdict per fix with evidence.

## Execution Steps

### 1. Capture Baseline

Capture the state before verification:
- `git log --oneline -5` — confirm what's being verified
- `git diff --stat` — see changed files
- `git diff HEAD~1` — review changes (if single fix commit)

### 2. Type Check

Run TypeScript compilation on affected projects:
- Backend: `npx tsc --noEmit` from project root
- Frontend: `cd clinic-frontend && npx tsc --noEmit`
- API: `cd api && npx tsc --noEmit` (if tsconfig exists)

**Fail condition**: Any new type errors (errors unrelated to fix must be pre-existing — confirm with baseline).

### 3. Lint Check

Run linters on affected files:
- Backend: `npm run lint`
- Frontend: `cd clinic-frontend && npm run lint`

**Fail condition**: Any lint error in modified files.

### 4. Run Test Suites

Execute tests in order of specificity:

**Unit tests (affected modules):**
- `npx vitest run tests/unit --reporter=verbose`
- Or: `npx vitest run --related <file1> <file2>`

**Integration tests:**
- `npx vitest run tests/integration`

**API tests:**
- `npx vitest run tests/api`

**Fail condition**: Any test failure in previously passing tests.

### 5. Regression Verification

For each fixed bug, verify the specific scenario that was broken:

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Replicate the original bug scenario | The error/issue from the bug report |
| 2 | Trace the code path through the fix | Fix intercepts the error path |
| 3 | Verify the fix handles edge cases | Null inputs, empty arrays, network errors |

For backend fixes: Trace the route/controller through the service/repository.
For frontend fixes: Trace the component render cycle and data flow.

### 6. Produce Verification Report

```
## Bug Verification Report

| BUG ID | TypeCheck | Lint | Unit Tests | Integration | Regression | Overall |
|--------|-----------|------|------------|-------------|------------|---------|
| BUG-001 | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | ✅ PASS | ✅ FIXED |
| BUG-003 | ✅ PASS | ✅ PASS | ⚠️ SKIP | ✅ PASS | ✅ PASS | ✅ FIXED |

### Summary

- **Total bugs verified**: 2
- **Passed**: 2
- **Failed**: 0
- **Skipped**: 0

### Per-Fix Details

#### BUG-001: [Summary]
- **TypeCheck**: PASS — no new errors
- **Lint**: PASS — no lint violations in modified files
- **Unit Tests**: 3/3 passed
- **Integration Tests**: 12/12 passed
- **Regression**: PASS — original scenario no longer reproducible
- **Verdict**: ✅ FIXED — bug is resolved, no regressions detected

### Regressions Detected (if any)

| ID | File | Issue | Severity |
|----|------|-------|----------|
| REG-001 | src/services/y.ts:30 | Previously passing test now fails | HIGH |
```

### 7. Next Actions

- **All pass**: Report success. Suggest: "All fixes verified. Run `/sp.bug-detect` for a fresh scan to confirm no new issues."
- **Any fail**: Report failures. Ask: "[N] verifications failed. Run `/sp.bug-fix` to re-attempt, or review manually?"
- **Regressions found**: Flag immediately: "Regression detected in [file:line]. Recommend reverting and re-implementing fix for BUG-XXX."

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage
   - Stage: misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3-7 words (slug for filename)
   - Route: `history/prompts/general/`

3) Create and Fill PHR (agent-native):
   - Read `.specify/templates/phr-template.prompt.md` or `templates/phr-template.prompt.md`
   - Allocate an ID; compute path as `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill all placeholders; embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report: no unresolved placeholders, path matches stage, print ID + path + stage + title.
