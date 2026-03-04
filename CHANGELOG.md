# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**, and this project adheres to **Semantic Versioning**.

---

## [1.3.1]

### Summary

- In this, I have implemented the necessary changes in the apis like `hirings` which are required to accept hiring requests from clients in an appropriate manner.

### Added

- There are no new files added in this version of release.

### Deprecated

- There are no deprecated changes in this change.

### Removed

- Nothing has been removed in this change.

### Fixed

- Pattern check in `addHiringDetailsValidator` middleware of add hiring details api.
- Pattern check in `addNewContactValidator` middleware if add contact details api.
- Removed min check from the `tenure` field of hiring model.

### Security

- There are no security related changes, fixes, add-ons in this change.

## [1.3.0]

### Summary

- In this, I have implemented the necessary changes in the apis like `login` which are required to show a captcha on the login page of `admin panel`.

### Added

- A captcha verification check in the `/authentication/login` api.
- Added `CHANGELOG.md` file in the project's root directory.
- Added partial logging in `/authentication/login` api.

### Changed

- Changed the allowed characters limit of address in `user.model.ts`.
- Changed the app start-up console message.
- Added app environment in `webpack` configuration file.
- Configured the `CI/CD` pipeline for release branch.

### Deprecated

- There are no deprecated changes in this change.

### Removed

- Nothing has been removed in this change.

### Fixed

- Configured the `cookie` for local, development and production environments.
- Old password check in `/user/edit-profile` api.

### Security

- There are no security related changes, fixes, add-ons in this change.
