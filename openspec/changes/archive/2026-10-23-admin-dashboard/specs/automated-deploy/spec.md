## Purpose

Defines automatic build and FTP deployment of the static site so published content never depends on a manual local upload.

## ADDED Requirements

### Requirement: Deploy triggers
The workflow SHALL run on push to `main`, on `repository_dispatch` of type `content-updated`, and on manual `workflow_dispatch`.

#### Scenario: Push to main
- **WHEN** a commit is pushed to `main`
- **THEN** a build and deploy run starts

#### Scenario: Content update dispatch
- **WHEN** a `repository_dispatch` event of type `content-updated` is received
- **THEN** a build and deploy run starts

### Requirement: Build and upload
Each run SHALL install dependencies with a clean install, build the site using sheet environment variables from repository secrets, and upload `dist/` to Hostinger over FTP using a pinned version of the deploy action.

#### Scenario: Successful deploy
- **WHEN** the build succeeds
- **THEN** the contents of `dist/` are uploaded to the configured FTP server

#### Scenario: Build failure stops upload
- **WHEN** the build fails
- **THEN** nothing is uploaded and the run is marked failed

### Requirement: Non-overlapping runs
Deploy runs SHALL be serialized through a concurrency group so two deployments never upload simultaneously.

#### Scenario: Two quick triggers
- **WHEN** a second trigger arrives while a deploy is running
- **THEN** it waits or supersedes per the concurrency group and never runs in parallel

### Requirement: Failure notification
A failed run SHALL notify the repository owner (GitHub default email is sufficient).

#### Scenario: Failed run
- **WHEN** a run fails
- **THEN** the owner receives a failure notification

### Requirement: Credentials not committed
FTP credentials and API keys SHALL be stored only in GitHub secrets and SHALL NOT appear in the repository or logs.

#### Scenario: Repository scan
- **WHEN** the repository is searched for FTP host, user or password
- **THEN** no credential value is found
