## Database Seeding (Local Development)

This project uses a custom seed script to initialize and populate a local MongoDB database with sample data for development and testing.

---

## Purpose

The seed script is designed to:

- Reset and initialize the database state
- Populate `users` and `courses` collections with sample data
- Provide a consistent dataset for testing authentication and role-based access
- Eliminate the need for manual database setup during development

---

## Running the Seed Script

Ensure your local MongoDB instance is running, then execute:

```bash
node scripts/seed.js