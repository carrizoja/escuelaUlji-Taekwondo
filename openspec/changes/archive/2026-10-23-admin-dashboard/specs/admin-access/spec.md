## Purpose

Restricts the dashboard to the owner and defines how secrets and concurrent writes are handled safely.

## ADDED Requirements

### Requirement: Owner-only access
The dashboard SHALL be deployed as a web app executing as the owner with access limited to the owner, relying on Google authentication with no custom login code. No roles SHALL exist.

#### Scenario: Other Google account
- **WHEN** any other account opens the web app URL
- **THEN** access is denied by Google

#### Scenario: Anonymous visitor
- **WHEN** an unauthenticated visitor opens the URL
- **THEN** no dashboard content is served

### Requirement: Secrets in Script Properties
The Cloudinary API key and secret and the GitHub token SHALL be stored only in Script Properties and SHALL NOT be committed. The GitHub token SHALL be fine-grained, limited to the single repository and to actions and contents scopes.

#### Scenario: Repo scan
- **WHEN** `admin/apps-script/` and its history are searched for secrets
- **THEN** none are found

### Requirement: Locked writes
Every sheet write SHALL be wrapped in a script lock so concurrent edits do not corrupt rows.

#### Scenario: Concurrent saves
- **WHEN** two saves are submitted at once
- **THEN** they are applied one after the other and neither is lost

#### Scenario: Lock timeout
- **WHEN** the lock cannot be obtained in time
- **THEN** the dashboard reports a retryable error and writes nothing

### Requirement: Documented rotation
Setup documentation SHALL describe how to rotate the GitHub token and Cloudinary secret.

#### Scenario: Rotation steps
- **WHEN** the owner reads the admin setup guide
- **THEN** steps to rotate each secret are present
