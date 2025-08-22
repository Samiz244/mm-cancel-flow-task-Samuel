-- seed.sql
-- Database schema and seed data for subscription cancellation flow
-- Does not include production-level optimizations or advanced RLS policies

-- Enable Row Level Security

-- Seed data
INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com')
ON CONFLICT (email) DO NOTHING;

-- Seed subscriptions with $25 and $29 plans
INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'), -- $25.00
  ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'), -- $29.00
  ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')  -- $25.00
ON CONFLICT DO NOTHING; 





-- Seed user_status table for existing users
INSERT INTO user_status (user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (user_id) DO NOTHING;

-- Seed migrate_mate_status table for existing users
INSERT INTO migrate_mate_status (user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (user_id) DO NOTHING;