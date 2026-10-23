# admin-event-management Specification

## Purpose

Lets the owner manage exams, tournaments and seminars from a dashboard and publish changes to the site without manual steps.

## Requirements

### Requirement: Event CRUD
The dashboard SHALL list, create, edit and delete records for Examenes, Torneos and Seminarios, locating rows by `id`.

#### Scenario: Create event
- **WHEN** the owner submits a valid new tournament
- **THEN** a row with a new UUID is appended to the Torneos tab

#### Scenario: Edit event
- **WHEN** the owner edits a seminar
- **THEN** only the row with that id is updated

#### Scenario: Delete event
- **WHEN** the owner confirms deletion of an exam
- **THEN** the row with that id is removed

### Requirement: Server-side validation
The server SHALL validate required fields and date format per event type and reject invalid input with field-level messages. Client checks are advisory only.

#### Scenario: Missing required field
- **WHEN** a submission lacks a required field
- **THEN** the save is rejected and the field is named in the error

#### Scenario: Bad date
- **WHEN** the date does not match the documented format
- **THEN** the save is rejected with a date format error

### Requirement: Header validation
Every read and write SHALL verify the tab headers against the documented schema and fail with a clear error if they differ.

#### Scenario: Broken sheet structure
- **WHEN** a required header was renamed manually
- **THEN** the dashboard shows an error naming the tab and header and does not write

### Requirement: Rebuild after save
After a successful events write the dashboard SHALL trigger a `content-updated` repository dispatch and inform the owner that changes appear in about 2 minutes.

#### Scenario: Save triggers deploy
- **WHEN** an event is saved
- **THEN** a dispatch is sent and the dashboard shows the expected delay

#### Scenario: Dispatch failure
- **WHEN** the dispatch request fails
- **THEN** the data remains saved and the dashboard warns that publishing was not triggered

### Requirement: Deploy status
The dashboard SHALL show the last deploy status and time obtained from GitHub.

#### Scenario: Last deploy failed
- **WHEN** the latest workflow run failed
- **THEN** the dashboard shows a failed status with its time
