-- Add lure_id column to lures table
-- lure_id is a unique string identifier for each lure, used for image file naming

-- Step 1: Add the column (nullable initially)
ALTER TABLE lures
ADD COLUMN lure_id TEXT;

-- Step 2: Populate lure_id with a default value based on existing id
-- You can customize this logic as needed
UPDATE lures
SET lure_id = 'lure_' || id::text;

-- Step 3: Make it NOT NULL and add unique constraint
ALTER TABLE lures
ALTER COLUMN lure_id SET NOT NULL;

ALTER TABLE lures
ADD CONSTRAINT lures_lure_id_unique UNIQUE (lure_id);

-- Step 4: Add index for performance
CREATE INDEX idx_lures_lure_id ON lures(lure_id);

-- Optional: Add comment for documentation
COMMENT ON COLUMN lures.lure_id IS 'Unique string identifier for lure, used for image file naming (e.g., lure_123)';
