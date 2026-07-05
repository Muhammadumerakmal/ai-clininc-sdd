---
description: Create a GitHub Pull Request from the current branch with an auto-generated title and description.
handoffs:
  - label: Commit Changes
    agent: sp.git.commit
    prompt: Commit changes before creating PR
  - label: Push to GitHub
    agent: sp.git.push
    prompt: Push the branch before creating PR
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). `$ARGUMENTS` may contain a PR title hint or target branch (e.g., `main`, `develop`).

## Goal

Create a GitHub Pull Request from the current branch with an auto-generated title, description, and labels based on the diff.

## Execution Steps

### 1. Gather Context

```bash
git --version
git rev-parse --is-inside-work-tree
git rev-parse --abbrev-ref HEAD
git log --oneline -10 --branches --not --remotes
git remote -v
git diff --stat main...HEAD 2>/dev/null || git diff --stat
gh --version 2>&1
gh auth status 2>&1
```

Abort if not in a git repo. Warn if `gh` CLI is not installed or not authenticated.

### 2. Pre-PR Checks

**Are there unpushed commits?**
```bash
git log --oneline @{u}..HEAD 2>/dev/null
```
If yes, warn: "[N] commits not yet pushed. Push them first? Run `/sp.git.push` or continue with local branch only? (y/N)"

**Is there an existing PR for this branch?**
```bash
gh pr list --head "$(git rev-parse --abbrev-ref HEAD)" --state open 2>&1
```
If an open PR exists, show its URL and ask: "An open PR already exists for this branch. Update it or create a new one?"

**Determine target branch:**
- `$ARGUMENTS` may specify target (e.g., `sp.git.pr main`)
- Default: `main` or `master` (whichever exists)
- If current branch IS `main`, abort: "Cannot create PR from main. Switch to a feature branch first."

### 3. Analyze Changes for PR Content

```bash
git diff main...HEAD --stat 2>/dev/null || git diff HEAD~1 --stat
```

Read the diff to generate:

**Title**: Start with conventional commit prefix (`feat:`, `fix:`, `refactor:`, etc.) + summary

**Description body**:
```
## Summary
<what changed, in one paragraph>

## Changes
- file/path.ts — <what was done here>
- file/path2.ts — <what was done here>

## Why
<motivation for these changes>

## Testing
<how to verify — manual steps or test commands>
```

**Labels**: Detect from file paths and diff content:
- `src/modules/**` → area label per module (e.g., `auth`, `pharmacy`)
- `clinic-frontend/**` → `frontend`
- `tests/**` → `tests`
- `*.md`, `docs/**` → `documentation`
- Package changes → `dependencies`

### 4. Create PR

```bash
gh pr create \
  --base <target-branch> \
  --head <current-branch> \
  --title "<generated-title>" \
  --body "<generated-description>" \
  --label "<label1,label2>" 2>&1
```

If `gh` is unavailable, fall back:
1. Print the PR URL for manual creation: `https://github.com/<owner>/<repo>/compare/<target>...<current>`
2. Suggest creating the PR manually with the generated title/description

Handle errors:
| Error | Handling |
|-------|----------|
| `already exists` | Offer to update: `gh pr edit <number> --title "" --body ""` |
| `base branch not found` | List available branches and ask user |
| Unknown | Show full error and suggest manual creation |

### 5. Report

```
✅ PR created

  URL:       https://github.com/owner/repo/pull/42
  Branch:    feature/add-auth → main
  Title:     feat(auth): add email validation
  Labels:    auth, backend

  Commits:   2
  Files:     3 changed

  Description preview:
  ## Summary
  Added email validation for user registration...

  To update:     gh pr edit 42 --title "<new>" --body "<new>"
  To view:       gh pr view 42 --web
```

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage: misc | general
2) Generate Title: 3-7 words (slug for filename)
3) Route: `history/prompts/general/`
4) Create and Fill PHR from template; validate no placeholders remain; print ID + path + stage + title.
