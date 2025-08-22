# Subscription Cancellation Flow – Migrate Mate

This project implements a subscription cancellation flow for **Migrate Mate** users.  
It collects data on whether users have found jobs, offers a downsell ($10 off), tracks user/job/visa status, and records feedback for continuous improvement.

---

## 🚀 Tech Stack
- **Next.js (App Router)** with React & TypeScript  
- **Supabase (Postgres + Row Level Security)** as the backend database  
- **Tailwind CSS** for styling  
- **API Routes** for user, subscription, and cancellation management  

---

## 📂 File Structure

src/app/
├── cancel/
│   ├── cancellation/          # Initial cancellation page
│   ├── job-status/            # “Have you found a job?” page
│   ├── job-success/           # Flow when user has found a job
│   ├── still-looking/         # Flow when user is still looking
│   │   └── downsell/          # Downsell offer
│   ├── downsell_accepted/     # Confirmation page for downsell
│   ├── improvement/           # Feedback page
│   ├── visa/                  # Immigration lawyer + visa info
│   └── employed-cancellation/ # Final confirmation
│
└── api/
├── profile/               # Fetch user + subscription profile
├── cancel/                # Handle subscription cancellation
├── accept/                # Accept downsell
├── init/                  # Initialize cancellation session
├── user_status/           # Update user status (employed, visa, lawyer)
└── migrate_mate_status/   # Update migrate mate stats


---

## 🗄️ Database Schema

### Users
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

### Subscriptions

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','pending_cancellation','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

### Cancellations

CREATE TABLE IF NOT EXISTS cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A','B')),
  accepted_downsell BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

### User_Status

CREATE TABLE IF NOT EXISTS user_status (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  employed BOOLEAN NOT NULL DEFAULT FALSE,
  has_immigration_lawyer BOOLEAN NOT NULL DEFAULT FALSE,
  future_visa_applying_for TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

### Migrate_Mate_Status

CREATE TABLE IF NOT EXISTS migrate_mate_status (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  applied_count INT NOT NULL DEFAULT 0,
  contacts_count INT NOT NULL DEFAULT 0,
  interviews_count INT NOT NULL DEFAULT 0,
  employed_through_mm BOOLEAN NOT NULL DEFAULT FALSE,
  improvement TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

🌱 Seed Data


INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO user_status (user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO migrate_mate_status (user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (user_id) DO NOTHING;


flowchart TD
  A[Cancellation Page] --> B[Init API - Assign Variant]
  B --> C{Found Job?}
  C -->|Yes| D[Job Success Page -> Save migrate_mate_status & user_status]
  C -->|No| E[Still Looking Page -> Save migrate_mate_status]

  D --> F[Improvement Page -> Save feedback]
  E --> F

  F --> G[Visa Page -> Update user_status (lawyer + visa type)]
  G --> H[Final Employed Cancellation Page]