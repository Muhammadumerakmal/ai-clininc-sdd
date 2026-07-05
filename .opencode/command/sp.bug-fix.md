---
description: Apply targeted fixes for identified bugs with minimal diff, respecting existing code conventions.
handoffs:
  - label: Detect Bugs
    agent: sp.bug-detect
    prompt: Scan for bugs to fix
  - label: Verify Fix
    agent: sp.bug-verify
    prompt: Verify the applied bug fixes
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

`$ARGUMENTS` should contain bug IDs (e.g., `BUG-001 BUG-003`) or paths (e.g., `src/services/x.ts`) or a general area (e.g., `pharmacy module`). If empty, load the latest bug report.

## Goal

Fix confirmed bugs with minimal, targeted changes that address root causes without refactoring unrelated code.

## Operating Constraints

- **Smallest viable diff**: Fix only what's broken. Do not refactor, rename, or restyle.
- **Preserve conventions**: Match existing patterns for error handling, null checks, imports, and styling.
- **No speculative fixes**: Only fix bugs explicitly identified or confirmed via `$ARGUMENTS`.
- **One commit per bug**: If committing, create separate commits for logically distinct fixes.
- **Always fix root cause**: Treat symptoms only when the root cause is unreachable (document the limitation).

## Execution Steps

### 1. Load Bug Context

If `$ARGUMENTS` contains explicit BUG IDs, read the latest bug report file (if any) for details. Otherwise:
- Run `git log --oneline -20` to understand recent changes
- Read the files/paths mentioned in `$ARGUMENTS`

### 2. Understand Root Cause

For each bug to fix:
1. Read the affected file(s) thoroughly — understand the surrounding code
2. Trace the data/call flow to identify the root cause
3. Check related files (imports, types, helpers, routes)
4. Look for the same pattern elsewhere to fix consistently

Document for each fix:
- **Root cause** (1 sentence)
- **Fix strategy** (1-2 sentences)

### 3. Apply Fix

Apply changes following these guidelines:

**Null/undefined fixes:**
- Use optional chaining `?.` over `&&` guards
- Use nullish coalescing `??` over `||` for non-boolean defaults
- Add early returns with guard clauses `if (!x) return` for invalid state
- Never use `!` non-null assertions — add proper checks instead

**Error handling fixes:**
- Wrap async route handlers in try/catch with proper error response
- Add meaningful error messages, not generic ones
- Log errors with enough context for debugging
- Never swallow errors silently (empty catch block)

**Type fixes:**
- Add proper type annotations instead of `any`
- Use type guards over type assertions
- Import missing types from correct modules

**React fixes:**
- Add missing dependency arrays to useEffect/useCallback/useMemo
- Add `key` props to list renders
- Fix stale closures by including dependencies
- Wrap side effects in proper cleanup functions

**Security fixes:**
- Add missing auth/permission middleware
- Validate and sanitize user input
- Remove hardcoded secrets

### 4. Verify Fix Locally

After each fix, verify:
- TypeScript compiles: `npx tsc --noEmit` (relevant directory)
- Lint passes: `npm run lint` (relevant directory)
- Related tests pass: `npx vitest run --related <file>` or similar

### 5. Report

Output a structured fix report:

```
## Bug Fix Report

| BUG ID | File | Status | Summary |
|--------|------|--------|---------|
| BUG-001 | src/services/x.ts | ✅ FIXED | Added null guard before user.name access |
| BUG-003 | src/routes/y.ts | ✅ FIXED | Wrapped handler in try/catch |

### Details

#### BUG-001: [Summary]
- **Root Cause**: `user` can be null when no match found in DB
- **Fix**: Added `if (!user) return res.status(404)...` guard before property access
- **Changed Lines**: src/services/x.ts:42-44

### Remaining Issues
- BUG-002: Requires deeper refactor — needs user approval
```

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
