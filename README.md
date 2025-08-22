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
## 📂 Project Structure
<details>
 

```text
src/
└── app/
    ├── cancel/
    │   ├── cancellation/
    │   ├── job-status/
    │   ├── job-success/
    │   ├── still-looking/
    │   ├── downsell/
    │   ├── downsell_accepted/
    │   ├── improvement/
    │   ├── visa/
    │   └── employed-cancellation/
    └── api/
        ├── profile/
        ├── cancel/
        ├── accept/
        ├── init/
        ├── user_status/
        └── migrate_mate_status/
lib/
└── supabase.ts
seed.sql
.env.local
README.md
</details>






