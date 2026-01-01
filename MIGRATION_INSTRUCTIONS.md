# Database Migration Instructions

Run this command in the KEC_BACKEND directory to create the live_matches table:

```bash
npx prisma migrate dev --name add_live_matches
```

Or if you prefer:

```bash
npx prisma db push
```

This will create the `live_matches` table in your database with the following structure:
- id (auto-increment)
- team1 (string)
- team2 (string)
- score (string, optional)
- time (string, optional)
- stream_url (string)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
