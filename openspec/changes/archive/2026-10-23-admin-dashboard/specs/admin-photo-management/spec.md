## Purpose

Lets the owner manage gallery photos, with images stored in Cloudinary and metadata in the Photos sheet, visible live on the site.

## ADDED Requirements

### Requirement: Photo CRUD
The dashboard SHALL list, create, edit and delete photos with fields title, description, alt, category, date, nivel, tags and image, locating rows by id.

#### Scenario: Add photo
- **WHEN** the owner submits a valid photo with an image
- **THEN** a row is added to the Photos tab with thumbnail and fullSize URLs

#### Scenario: Missing alt text
- **WHEN** the alt field is empty
- **THEN** the save is rejected

### Requirement: Signed Cloudinary upload
Image upload SHALL use a server-generated Cloudinary signature; the browser uploads directly to Cloudinary and the API secret SHALL never reach the browser.

#### Scenario: Upload
- **WHEN** the owner selects an image
- **THEN** the server returns a signature and the browser uploads to Cloudinary using it

#### Scenario: Secret not exposed
- **WHEN** page source and network traffic are inspected
- **THEN** the Cloudinary API secret does not appear

### Requirement: Derived thumbnail
The thumbnail URL SHALL be derived from the uploaded image through a Cloudinary transformation.

#### Scenario: Thumbnail generated
- **WHEN** a photo is saved
- **THEN** its thumbnail value is a transformation URL of the same asset

### Requirement: Optional asset deletion
When deleting a photo the owner SHALL be able to choose to also delete the Cloudinary asset.

#### Scenario: Delete with asset
- **WHEN** the owner deletes a photo and ticks the asset deletion option
- **THEN** the sheet row and the Cloudinary asset are removed

#### Scenario: Delete row only
- **WHEN** the option is not ticked
- **THEN** only the sheet row is removed

### Requirement: Live visibility
Photo changes SHALL appear on the gallery without a site rebuild.

#### Scenario: New photo visible
- **WHEN** a photo is saved
- **THEN** the gallery shows it on next load without a deploy
