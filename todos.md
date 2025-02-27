# Migration To-Do List for Manifold Love

## Objective
Migrate Manifold Love’s API server and database from using the shared Manifold infrastructure to a dedicated infrastructure, while ensuring Manifold remains unaffected.

## Tasks
- [ ] Audit current dependencies:
  - Identify API endpoints and database usage in the Manifold Love web code.
  - Document settings/configuration values currently inherited from Manifold.

- [ ] Set up new infrastructure:
  - Provision a dedicated API server for Manifold Love.
  - Provision a separate database instance exclusively for Manifold Love.
  - Update environment configurations (e.g., connection strings, API URLs) for the new setup.

- [ ] Data migration:
  - Backup existing Love data.
  - Migrate/restore data to the new database.

- [ ] Code and configuration changes:
  - Update the Manifold Love webpage configuration to point to the new API endpoint.
  - Remove or update any deprecated integrations that reference the main Manifold database/API.

- [ ] Testing and validation:
  - Deploy the new API and database in a staging environment.
  - Run integration tests to verify that the webpage connects to the new backend.
  - Confirm functionality and performance before full cutover.

- [ ] Cutover plan:
  - Schedule a downtime period for Manifold Love (acceptable downtime).
  - Perform a final sync/migration if needed.
  - Switch traffic to the new infrastructure.
  - Monitor for issues and have a rollback plan ready.

## Notes
- Downtime is acceptable for Manifold Love (low usage) but must be zero for main Manifold.
- Ensure proper rollback and monitoring procedures are in place during the migration.
