---
description: Scan the codebase to detect, triage, and report bugs with reproduction steps and severity.
handoffs:
  - label: Fix Bug
    agent: sp.bug-fix
    prompt: Fix the detected bug
  - label: Verify Fix
    agent: sp.bug-verify
    prompt: Verify the bug fix
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Systematically detect bugs across the codebase (backend `src/`, frontend `clinic-frontend/`, and API `api/`), classify severity, and produce a structured bug report with reproduction steps.

## Detection Scope

Scan these areas based on `$ARGUMENTS` (if specific module/area given) or full codebase:

- **TypeScript/JavaScript**: Type errors, null references, Promise handling, race conditions
- **API/Express routes**: Missing validation, unhandled errors, wrong status codes, broken middleware chains
- **React/Next.js**: Missing keys, stale closures, infinite re-renders, hydration mismatches
- **Async operations**: Uncaught promise rejections, missing error boundaries, improper `await`
- **Data layer**: Missing null checks on DB results, incorrect queries, transaction issues
- **Auth/Security**: Missing permission checks, exposed endpoints, token handling bugs
- **Configuration**: Missing env vars, incorrect imports, broken path aliases

## Execution Steps

### 1. Build Dependency Map

Run the following to understand project structure:
- `Get-ChildItem -Path "src/" -Recurse -Filter "*.ts"` (backend)
- `Get-ChildItem -Path "clinic-frontend/src/" -Recurse -Filter "*.ts*"` (frontend)
- `Get-ChildItem -Path "api/" -Recurse -Filter "*.ts"` (API)

Parse `package.json` and `clinic-frontend/package.json` for build/test scripts.

### 2. Run Static Analysis

Execute type-checking and linting to catch detectable issues:
- Backend: `npx tsc --noEmit` 
- Backend lint: `npm run lint`
- Frontend: `cd clinic-frontend && npx tsc --noEmit`
- Frontend lint: `cd clinic-frontend && npm run lint`

Capture ALL errors and warnings for analysis.

### 3. Targeted Bug Pattern Search

Use `rg` (ripgrep) or `Select-String` to detect known bug patterns:

**Null/undefined safety:**
- `.` member access after optional chain `?.` — check for missing fallback
- `!` non-null assertions — verify the invariant holds
- `as` type assertions — verify correctness

**Error handling:**
- `try {` blocks without corresponding `catch` or with empty `catch {}`
- `.catch(` handlers that re-throw without logging
- Express routes without error handler wrappers
- Missing `next()` in middleware

**Async bugs:**
- Promises without `await` in async functions
- Missing `void` for fire-and-forget
- `for await` without error handling

**React-specific:**
- `useEffect` missing dependencies
- `useCallback`/`useMemo` with stale closures
- Missing `key` props in `.map()` renders
- State updates outside of React lifecycle

**Auth/security:**
- Routes without auth middleware
- Hardcoded secrets or tokens
- Missing input sanitization

### 4. Run Existing Tests

Execute test suites to find failing tests that indicate regressions:
- `npm test` (or equivalent)
- `cd clinic-frontend && npm test` (if test script exists)

Record which tests pass/fail and extract error messages.

### 5. Triage & Classify

For each detected issue, classify by:

**Severity:**
- **CRITICAL**: Data loss, security breach, auth bypass, crash on main flow
- **HIGH**: Feature broken, incorrect behavior, major UI breakage
- **MEDIUM**: Edge case failure, minor UI issue, non-critical error
- **LOW**: Cosmetic, typo, dev experience, minor performance

**Category:**
- Type Error | Runtime Error | Logic Bug | Security | UI/UX | Performance | Regression

### 6. Produce Bug Report

Output a structured report with this format:

```
## Bug Detection Report

| ID | File:Line | Severity | Category | Summary |
|----|-----------|----------|----------|---------|
| BUG-001 | src/services/x.ts:42 | HIGH | Logic Bug | Null check missing before property access |
| BUG-002 | clinic-frontend/src/app/page.tsx:15 | MEDIUM | UI/UX | Missing key prop in map render |

### Detailed Findings

#### BUG-001: [Summary]
- **File**: `src/services/x.ts:42`
- **Severity**: HIGH
- **Category**: Logic Bug
- **Root Cause**: `user.name` accessed without checking if `user` is null
- **Reproduction**: Call `getUserProfile()` with non-existent user ID
- **Recommended Fix**: Add `user?.name` or null guard before access
```

**Summary Metrics:**
- Total bugs found
- By severity: CRITICAL / HIGH / MEDIUM / LOW
- By category: Type / Runtime / Logic / Security / UI / Performance
- Test results: passed / failed / skipped

### 7. Next Actions

After the report:
1. If CRITICAL or HIGH bugs exist: Ask user: "Found [N] critical/high bugs. Run `/sp.bug-fix <BUG-IDs>` to fix them?"
2. If only MEDIUM/LOW: Ask user: "Found [N] low-severity issues. Proceed with fixes or view full report?"
3. Always offer: "Run `/sp.bug-fix` to start fixing, or `/sp.bug-verify` after fixes are applied."

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
