# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**, and this project adheres to **Semantic Versioning**.

---

## [Unreleased]

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

### Deprecated

- There are no deprecated changes in this change.

### Removed

- Nothing has been removed in this change.

### Fixed

- Configured the `cookie` for local, development and production environments.
- Old password check in `/user/edit-profile` api.

### Security

- There are no security related changes, fixes, add-ons in this change.
