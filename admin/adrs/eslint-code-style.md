# ESLINT for code style

## Considered Options

### Option 1: Add Superlinter as code style
- **Pros:**
  - Handles for all the programming languages(C++,Java,JavaScript..)
- **Cons:**
  - For the above repo, the changes it provided was too much(~4000) as it was giving error even for space not present in between if and '('.
  - Runs all the linter for a typescript focused repo taking too much time.
  - Not known much to others compared to Eslint.

### Option 2: Add Eslint as code style
- **Pros:**
  - Famous and known to people so won't have difficulty in incorportating it in the codebase.
  - Follwed KISS (keep it super simpler) during design decision as the codebase is of Javascript + Typescript.
- **Cons:**
  - Difficult to add it in this repo as the repo is tightly coupled so needs to figure out the version which would work.

---

## Decision Outcome

**Chosen Option:** “Add Eslint as code style"  
We decided to go with Eslint as it provides a deep integratin with javascript as well as it can be integrated smoothly with IDE so people can look for the errors/warnings while coding.
