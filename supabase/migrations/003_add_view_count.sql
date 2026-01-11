-- Add view_count column to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_blogs_view_count 
ON blogs(view_count DESC);

-- Update existing blogs to have 0 views
UPDATE blogs SET view_count = 0 WHERE view_count IS NULL;
