---
description: Stage changes and create a meaningful commit based on code analysis.
handoffs:
  - label: Push to GitHub
    agent: sp.git.push
    prompt: Push the committed changes
  - label: Create PR
    agent: sp.git.pr
    prompt: Create a PR from the current branch
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). `$ARGUMENTS` may contain a commit message hint or scope.

## Goal

Analyze unstaged changes, stage them intelligently, generate a conventional commit message from the diff, and commit.

## Execution Steps

### 1. Gather Context

Run these to understand the current state:
```bash
git --version
git rev-parse --is-inside-work-tree
git status --porcelain
git diff --stat
git diff --cached --stat
git log --oneline -5
git rev-parse --abbrev-ref HEAD
```

Abort with a clear message if not in a git repo or no changes detected.

### 2. Analyze Changes

Read the diff of unstaged files to understand intent:
```bash
git diff
```

Classify changes by type:
- `feat` — New features, new files, new logic
- `fix` — Bug fixes, error handling, edge cases
- `refactor` — Restructuring without behavior change
- `chore` — Config, deps, tooling, CI
- `docs` — Documentation, comments
- `test` — Test files only
- `style` — Formatting, linting, cosmetic

Extract the **scope** from the directory/module pattern of changed files (e.g., `auth`, `pharmacy`, `patient`, `frontend`).

### 3. Generate Commit Message

Use conventional commit format:
```
<type>(<scope>): <imperative subject>

<body explaining why, not what>
```

- **Subject**: Present tense, imperative, ≤ 72 chars
- **Body**: Explain motivation and tradeoffs (omit if trivial)

Do NOT ask the user for a message. Derive it from the diff content:
- Look at function names, file paths, and added/removed lines
- If `$ARGUMENTS` provides a hint, incorporate it

### 4. Stage and Commit

Stage changes:
```bash
git add -A
```

Commit with the generated message:
```bash
git commit -m "<type>(<scope>): <subject>" -m "<body>"
```

If commit fails (e.g., hooks reject), show the full error and suggest manual fixes.

### 5. Report

```
✅ Commit created

  Branch:   feature/add-auth
  Commit:   a1b2c3d
  Message:  feat(auth): add email validation

  Files:    3 changed, 45 insertions(+), 2 deletions(-)

Next: Run `/sp.git.push` to push to remote, or `/sp.git.pr` to create a PR.
```

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage: misc | general
2) Generate Title: 3-7 words (slug for filename)
3) Route: `history/prompts/general/`
4) Create and Fill PHR from template; validate no placeholders remain; print ID + path + stage + title.
