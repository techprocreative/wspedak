-- Add admin role for edo.doyokz@gmail.com
-- Run this in Supabase SQL Editor

-- First, get the user ID
SELECT id, email FROM auth.users WHERE email = 'edo.doyokz@gmail.com';

-- Then insert the admin role (replace USER_ID with the actual ID from above query)
-- INSERT INTO user_roles (user_id, role) VALUES ('USER_ID', 'admin');

-- Or do it in one query:
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'edo.doyokz@gmail.com'
ON CONFLICT DO NOTHING;
