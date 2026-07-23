# AlgoVerse — Final Documentation Patches

Version: 1.0

Status: Pending Application

---

# Purpose

This document contains the final documentation corrections required before implementation begins.

These patches align the documentation with the finalized agent-driven development workflow.

The goal is to improve autonomous development, interruption recovery, deployment readiness, environment variable handling, and external service integration.

---

# Scope

Apply patches ONLY to the files explicitly listed in this document.

Do NOT modify any other documentation files.

Do NOT rewrite documentation unnecessarily.

Preserve existing formatting, numbering, headings, markdown style, wording, and structure wherever possible.

Only insert, replace, or update the sections explicitly described below.

---

# IMPORTANT

The project will be developed using

- Antigravity
- Autonomous Turbo Mode
- Multiple AI sessions
- Multiple ChatGPT accounts
- Multiple coding agents and sub-agents

Documentation must therefore support interrupted development and seamless continuation.

---

# Global Agent Behavior

These rules apply to the ENTIRE documentation repository.

They should be reflected wherever applicable.

## Autonomous Execution

Assume the coding agent is operating with Turbo Mode enabled.

The agent may automatically

- execute PowerShell commands
- execute terminal commands
- install packages
- uninstall packages
- run npm commands
- run development servers
- run build commands
- run lint
- run tests
- create files
- edit files
- rename files
- move files
- reorganize folders
- update documentation
- update project state

without requesting user confirmation.

Whenever possible, the agent should complete work autonomously.

---

## Safe Autonomous Behavior

Before performing destructive operations, the agent must verify they are necessary.

The agent must NEVER

- invent credentials
- invent API keys
- invent secrets
- invent OAuth values
- invent database URIs
- invent production URLs
- delete completed user code unnecessarily
- overwrite completed features
- remove documentation without reason
- reset Git history
- force push
- expose secrets

Prefer refactoring over deletion.

---

## External Services

The following services require user-owned accounts or credentials.

- MongoDB Atlas
- Google OAuth
- Cloudinary
- Vercel
- Render
- GitHub Secrets
- Domain Providers
- DNS Providers

The coding agent MUST assume these services exist but MUST NOT assume access to them.

---

## External Setup Checkpoint

Whenever implementation reaches a feature requiring one or more external services, the coding agent must

1. Complete every possible coding task that does not require credentials.

2. Generate `.env.example` if it does not already exist.

3. Document every required environment variable.

4. Explain exactly what the user must configure.

5. Update `00_PROJECT_STATE.md`.

6. Record all pending configuration under

Waiting For User

and

Pending Manual Steps.

7. Pause implementation.

8. Wait until the user confirms configuration is complete.

9. Resume automatically from the recorded project state.

---

## Definition of Deployment

Throughout the documentation, deployment should be interpreted as

Deployment Ready

NOT

Deployment Completed

Unless the documentation explicitly refers to manual deployment performed by the project owner.

Deployment Ready means

- Production build succeeds.
- Configuration is complete.
- Deployment files exist.
- Environment variables are documented.
- Deployment instructions are generated.
- Project is ready for deployment.

Actual deployment remains the responsibility of the project owner.

---

## Manual Configuration

The coding agent is responsible for

- Writing code
- Refactoring
- Testing
- Documentation
- Build verification
- Deployment preparation
- Deployment documentation
- Environment variable documentation

The project owner is responsible for

- Creating cloud accounts
- Supplying credentials
- Creating OAuth applications
- Configuring MongoDB Atlas
- Configuring Cloudinary
- Connecting Vercel
- Connecting Render
- Configuring DNS
- Managing secrets
- Approving production deployment

---

## Testing Policy

Whenever documentation mentions Testing Complete, Deployment Complete, or Production Ready involving external services, separate the work into

Automated Verification

and

Manual Verification

The coding agent performs Automated Verification.

The project owner performs Manual Verification involving external accounts, credentials, browsers, production environments, or cloud services.

---

# PATCHES

The following patches must be applied exactly as specified.

Do not modify any unrelated content.

Preserve existing formatting.

Each patch specifies

- Target File
- Location
- Action
- Content

============================================================
PATCH 01
============================================================

Target File

00_PROJECT_STATE.md

------------------------------------------------------------

Location

Find

# Session Tracking

------------------------------------------------------------

Action

Insert the following section immediately BEFORE

## Last Updated

Do not modify any existing content.

------------------------------------------------------------

Content

## Waiting For User

Record every dependency that requires manual configuration.

Examples

- MongoDB Atlas URI
- Google OAuth Credentials
- Cloudinary Credentials
- Vercel Project
- Render Service
- GitHub Repository
- Domain Configuration

If this section is not empty, implementation depending on these services must pause until the user completes configuration.

---

## Pending Manual Steps

Record every task that requires human interaction.

Examples

- Create MongoDB Atlas Cluster
- Configure Google OAuth
- Configure Cloudinary
- Connect Vercel
- Connect Render
- Configure DNS
- Configure Production Environment Variables

---

## Last Safe Checkpoint

Always record

- Last completed file
- Last successful build
- Last successful lint
- Last Git commit

This represents the safest recovery point if development is interrupted.

------------------------------------------------------------

Expected Result

The project state should always clearly indicate

- what the AI is waiting for
- what the user must do
- where development can safely resume

============================================================
PATCH 02
============================================================

Target File

01_AGENT_INSTRUCTIONS.md

------------------------------------------------------------

Location

Append near the end of the document under the final instruction section.

------------------------------------------------------------

Action

Insert the following new section.

------------------------------------------------------------

Content

# Autonomous Development Rules

The coding agent is operating with Turbo Mode enabled.

The agent may automatically

- execute PowerShell commands
- execute terminal commands
- install packages
- remove unused packages
- run npm commands
- run development servers
- run build commands
- run lint
- run tests
- edit project files
- update documentation
- update project state

without requesting confirmation.

The agent should complete as much work as possible autonomously.

Only pause when

- user credentials
- cloud configuration
- payment
- domain ownership
- external approvals

are required.

============================================================
PATCH 03
============================================================

Target File

33_DEPLOYMENT.md

------------------------------------------------------------

Location

Find

# Environment Variables

------------------------------------------------------------

Action

Insert immediately AFTER this heading.

------------------------------------------------------------

Content

# External Credentials Policy

Some configuration values cannot be generated automatically.

Examples

- MongoDB Atlas URI
- JWT Secret
- JWT Refresh Secret
- Google OAuth Client ID
- Google OAuth Client Secret
- Cloudinary Cloud Name
- Cloudinary API Key
- Cloudinary API Secret

The coding agent must NEVER invent these values.

Whenever implementation reaches one of these requirements, the agent must

1. Complete every possible coding task.
2. Generate .env.example.
3. Document every required environment variable.
4. Explain exactly how the user obtains each value.
5. Pause implementation.
6. Resume after user confirmation.

============================================================
PATCH 04
============================================================

Target File

33_DEPLOYMENT.md

------------------------------------------------------------

Location

Find

# Acceptance Criteria (Infrastructure)

------------------------------------------------------------

Action

Replace ONLY the acceptance criteria list.

------------------------------------------------------------

Content

Deployment infrastructure is complete when

- Production frontend build succeeds.
- Production backend build succeeds.
- Deployment configuration is complete.
- Environment variables are documented.
- .env.example exists.
- Deployment guide is generated.
- CI pipeline executes successfully.
- Required cloud services are documented.
- Project is deployment-ready.

Actual deployment remains the responsibility of the project owner.

============================================================
PATCH 05
============================================================

Target File

34_MASTER_AGENT_PROMPT.md

------------------------------------------------------------

Location

Find

# DEVELOPMENT RULES

------------------------------------------------------------

Action

Insert immediately AFTER this heading.

------------------------------------------------------------

Content

# Autonomous Execution Rules

Assume Turbo Mode is enabled.

The agent may automatically

- execute PowerShell
- execute terminal commands
- install packages
- run npm commands
- run builds
- run lint
- run tests
- edit files
- create files
- rename files
- reorganize folders
- update documentation

The agent should complete all safe tasks autonomously.

Never ask for confirmation unless

- credentials
- cloud services
- production deployment
- payment
- destructive operations

are involved.

============================================================
PATCH 06
============================================================

Target File

34_MASTER_AGENT_PROMPT.md

------------------------------------------------------------

Location

Find

# DEVELOPMENT RULES

(Insert AFTER Patch 05)

------------------------------------------------------------

Action

Insert the following section immediately after the Autonomous Execution Rules.

------------------------------------------------------------

Content

# External Service Rules

The following services require user-owned accounts or credentials.

- MongoDB Atlas
- Google OAuth
- Cloudinary
- Vercel
- Render
- GitHub Secrets
- DNS Providers
- Domain Providers

Whenever implementation reaches a feature requiring one or more of these services, the coding agent MUST

1. Complete every possible coding task that does not require credentials.

2. Generate `.env.example` if it does not already exist.

3. Document every required environment variable.

4. Explain exactly what the user must configure.

5. Update `00_PROJECT_STATE.md`.

6. Record pending items under

- Waiting For User
- Pending Manual Steps

7. Pause implementation.

8. Wait for user confirmation.

9. Resume automatically from the recorded project state.

The agent must NEVER

- invent credentials
- invent secrets
- invent OAuth values
- invent API keys
- invent database URIs
- invent passwords

------------------------------------------------------------

Expected Result

The agent understands exactly when to stop autonomous implementation and wait for user configuration.

============================================================
PATCH 07
============================================================

Target File

35_IMPLEMENTATION_PLAN.md

------------------------------------------------------------

Location

Find

# Session Recovery Rules

------------------------------------------------------------

Action

Insert immediately AFTER this section.

------------------------------------------------------------

Content

# External Setup Checkpoints

Certain implementation tasks require user-owned cloud accounts, credentials, or external configuration.

Examples

- MongoDB Atlas
- Google OAuth
- Cloudinary
- Vercel
- Render
- GitHub Secrets

When such a checkpoint is reached, the coding agent MUST

1. Complete all possible implementation.

2. Save every modified file.

3. Verify the project builds if possible.

4. Generate `.env.example`.

5. Document every required environment variable.

6. Generate deployment instructions if required.

7. Update `00_PROJECT_STATE.md`.

8. Pause implementation.

9. Wait for the user.

10. Resume automatically after confirmation.

------------------------------------------------------------

Expected Result

Development never fails because of missing credentials.

Instead it pauses safely and resumes later.

============================================================
PATCH 08
============================================================

Target File

35_IMPLEMENTATION_PLAN.md

------------------------------------------------------------

Location

Find

# Definition of Done

------------------------------------------------------------

Action

Replace ONLY the Deployment-related completion requirements.

Do NOT modify unrelated requirements.

------------------------------------------------------------

Content

Deployment-related work is complete when

- Production builds succeed.
- Configuration is complete.
- `.env.example` exists.
- Required environment variables are documented.
- Deployment guide is generated.
- Deployment configuration has been verified.
- Project is deployment-ready.

If deployment requires external accounts or credentials,

implementation pauses until the project owner completes configuration.

------------------------------------------------------------

Expected Result

The implementation plan reflects deployment readiness rather than assuming deployment can always be completed automatically.

============================================================
PATCH 09
============================================================

Target File

32_TESTING.md

------------------------------------------------------------

Location

Find

# Acceptance Criteria

(or the final testing completion section)

------------------------------------------------------------

Action

Insert the following section immediately BEFORE the final completion criteria.

------------------------------------------------------------

Content

# Manual Verification

The coding agent performs automated verification.

The project owner performs manual verification.

Manual verification includes

- Google OAuth Login
- Cloudinary Uploads
- Production Environment Variables
- Production Deployment
- DNS
- SSL Certificates
- External Redirects
- Third-party Account Configuration

The coding agent must never assume these tests have passed.

If external configuration is required,

mark the feature as

Waiting For Manual Verification

instead of

Complete.

------------------------------------------------------------

Expected Result

Testing distinguishes automated verification from manual verification.

============================================================
PATCH 10
============================================================

Target File

Entire Documentation Repository

------------------------------------------------------------

Action

Perform a final documentation consistency review.

Do NOT rewrite documentation.

Only apply the following consistency rules wherever applicable.

------------------------------------------------------------

Rules

1.

Whenever documentation refers to

"Deployment Complete"

or

"Deployment Successful"

replace it with

"Deployment Ready"

ONLY if the wording refers to automated implementation.

Do NOT modify wording that explicitly describes manual deployment by the project owner.

---

2.

Whenever documentation assumes the coding agent owns cloud accounts,

replace that assumption with

"The project owner supplies credentials."

---

3.

Whenever documentation assumes secrets exist,

replace with

"Document the required environment variables."

---

4.

Whenever documentation reaches a point requiring external credentials,

ensure the workflow becomes

Finish implementation

↓

Generate `.env.example`

↓

Document required variables

↓

Update `00_PROJECT_STATE.md`

↓

Pause

↓

Wait for user

↓

Resume

---

5.

Never modify Future, Future Enhancements, Future Expansion, or Possible Improvements sections unless explicitly required.

------------------------------------------------------------

Expected Result

The entire documentation becomes internally consistent with autonomous AI development, Turbo Mode execution, and user-managed cloud infrastructure.

============================================================
PATCH 11
============================================================

Target File

34_MASTER_AGENT_PROMPT.md

------------------------------------------------------------

Location

Find

# DEVELOPMENT RULES

(or insert after PATCH 05 and PATCH 06 additions if they have already been applied)

------------------------------------------------------------

Action

Insert the following section.

------------------------------------------------------------

Content

# Command Execution Policy

The coding agent operates in Autonomous Turbo Mode.

Assume terminal access, PowerShell execution, and automatic command approval are enabled.

The agent should prefer autonomous execution whenever it is safe to do so.

The agent may automatically

- execute PowerShell commands
- execute terminal commands
- install dependencies
- uninstall unused dependencies
- update dependencies
- run npm install
- run npm run dev
- run npm run build
- run npm run lint
- run npm test
- execute Git status
- execute Git diff
- create folders
- create files
- rename files
- move files
- reorganize folders
- update documentation
- update project state

without requesting confirmation.

------------------------------------------------------------

If a command fails

the agent must

1. Read the complete error output.

2. Determine the root cause.

3. Apply the smallest safe fix.

4. Retry the command once.

5. Continue automatically if successful.

The agent should not stop after the first error if it is capable of fixing the issue autonomously.

------------------------------------------------------------

The agent must pause only when

- user credentials are required
- cloud account configuration is required
- payment is required
- domain ownership is required
- legal acceptance is required
- external authentication requires user interaction
- a destructive Git operation would be required
- multiple valid architectural decisions exist and user preference is required

------------------------------------------------------------

The agent must NEVER automatically execute

- git reset --hard
- git clean -fd
- git push --force
- force pushes
- branch deletion
- history rewriting
- deleting user-created source code without verification
- exposing secrets
- inventing credentials

------------------------------------------------------------

If implementation is blocked by user configuration

the agent must

1. Finish every remaining coding task that does not require the missing configuration.

2. Save all modified files.

3. Update

00_PROJECT_STATE.md

including

- Waiting For User
- Pending Manual Steps
- Resume From
- Last Safe Checkpoint

4. Generate

.env.example

if required.

5. Generate deployment or setup instructions if required.

6. Clearly explain exactly what the user must do.

7. Pause implementation.

8. Resume automatically after the user confirms completion.

------------------------------------------------------------

Expected Result

The coding agent behaves like an autonomous senior developer.

It should continue solving problems independently whenever possible and interrupt the user only when human-owned credentials, cloud configuration, or irreversible decisions are genuinely required.

============================================================
FINAL EXECUTION & VALIDATION
============================================================

Apply every patch in the exact order listed.

Do not skip patches.

Do not reorder patches.

Do not modify files that are not explicitly listed.

------------------------------------------------------------

After completing EACH patch

- Save every modified file.
- Verify the Markdown structure remains valid.
- Preserve headings, numbering, formatting, and style.
- Do not rewrite unrelated content.
- Verify that the intended modification has been applied correctly before continuing.

------------------------------------------------------------

After ALL patches have been applied

Perform a complete repository validation.

Verify

✓ Documentation formatting is preserved.

✓ Markdown structure is preserved.

✓ Numbering remains unchanged.

✓ Existing architecture remains unchanged.

✓ Existing feature specifications remain unchanged.

✓ Technology stack remains unchanged.

✓ No duplicate sections were introduced.

✓ No contradictory instructions exist.

✓ Autonomous Turbo Mode workflow is fully documented.

✓ External setup checkpoints are fully documented.

✓ External credential workflow is fully documented.

✓ Deployment documentation reflects "Deployment Ready" where appropriate.

✓ Project State supports interrupted AI sessions.

✓ Project State supports multiple AI accounts.

✓ Project State supports multiple autonomous coding agents.

✓ Manual configuration checkpoints are documented.

✓ Environment variable handling is documented.

✓ No placeholder text remains.

✓ No broken Markdown sections exist.

✓ All modified files remain internally consistent.

------------------------------------------------------------

If any issue is detected

- Correct it automatically.
- Revalidate the affected file.
- Continue until validation passes.

------------------------------------------------------------

Final Output

Return a concise report containing

1. Files modified

2. Sections added

3. Sections replaced

4. Any sections intentionally left unchanged

5. Validation results

6. Any recommendations before implementation begins

The documentation should be left in a production-ready state for autonomous AI-driven development.

============================================================
POST-EXECUTION
============================================================

After successfully applying every patch and completing validation

1. Re-read every modified documentation file.

2. Verify that all cross-references remain valid.

3. Verify there are no contradictory instructions.

4. Ensure all documentation consistently reflects

- Autonomous Turbo Mode
- Interrupted session recovery
- External credential checkpoints
- Deployment-ready workflow
- User-managed cloud infrastructure

5. Once verification succeeds

this patch document has fulfilled its purpose.

It should NOT be referenced during implementation.

The project owner may archive or delete this file.

Future development should rely only on the documentation set (00–35).

Return a final migration report.