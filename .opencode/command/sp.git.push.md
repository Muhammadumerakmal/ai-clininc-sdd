---
description: Push committed changes to the remote GitHub repository with upstream tracking.
handoffs:
  - label: Commit Changes
    agent: sp.git.commit
    prompt: Commit changes before pushing
  - label: Create PR
    agent: sp.git.pr
    prompt: Create a PR from the pushed branch
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). `$ARGUMENTS` may specify a remote name (default: `origin`) or branch name.

## Goal

Push committed local changes to the remote GitHub repository, setting up upstream tracking if needed. Handle authentication and common push errors gracefully.

## Execution Steps

### 1. Gather Context

```bash
git --version
git rev-parse --is-inside-work-tree
git status --porcelain
git log --oneline -3 --branches --not --remotes
git rev-parse --abbrev-ref HEAD
git remote -v
```

Abort if not in a git repo. Check if there are unpushed commits:
```bash
git log --oneline @{u}..HEAD 2>/dev/null
```
If the above fails (no upstream), treat all local commits as unpushed.

### 2. Pre-push Checks

**Check for uncommitted changes**:
```bash
git status --porcelain
```
If uncommitted changes exist, warn: "You have [N] uncommitted changes. Run `/sp.git.commit` first, or add them to this push? (y/N)" — wait for answer. If no answer within timeout, abort.

**Check remote reachability**:
```bash
git ls-remote --exit-code origin 2>&1
```
If remote unreachable, show the error and suggest checking: `git remote -v`, network, credentials.

**Check GitHub auth**:
```bash
gh auth status 2>&1
```
If `gh` is not authenticated, check if `GITHUB_TOKEN` env var is set. If neither works, warn: "GitHub CLI not authenticated. Push will proceed but PR creation may fail."

### 3. Determine Push Strategy

| State | Action |
|-------|--------|
| Current branch has upstream tracking | `git push` |
| Current branch has NO upstream | `git push -u origin <branch>` |
| `$ARGUMENTS` specifies remote/branch | Use specified values |
| Detached HEAD | Abort with instructions to create a branch first |

### 4. Execute Push

```bash
git push -u origin <branch> 2>&1
```

**Handle errors**:

| Error | Handling |
|-------|----------|
| `non-fast-forward` | Warn: "Remote has commits you don't have locally. Run `git pull --rebase` first." |
| `Connection refused` | Check remote URL with `git remote -v`; suggest fixing |
| `Permission denied` | Check auth; suggest `gh auth login` or PAT token |
| `failed to push` | Show full error and suggest manual resolution |
| Success | Proceed to report |

### 5. Report

```
✅ Push successful

  Remote:    origin
  Branch:    feature/add-auth
  Commits:   2 pushed
  Commit:    a1b2c3d feat(auth): add email validation
             b4e5f6g fix(auth): handle null user

  Remote URL: https://github.com/owner/repo/tree/feature/add-auth

Next: Run `/sp.git.pr` to create a PR from this branch.
```

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage: misc | general
2) Generate Title: 3-7 words (slug for filename)
3) Route: `history/prompts/general/`
4) Create and Fill PHR from template; validate no placeholders remain; print ID + path + stage + title.
