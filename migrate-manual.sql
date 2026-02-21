-- Step 1: Rename conflicting old tables
RENAME TABLE `products` TO `products_legacy`;
RENAME TABLE `users` TO `users_legacy`;

-- Step 2: Clear migration journal so drizzle can run fresh
DELETE FROM `__drizzle_migrations`;
