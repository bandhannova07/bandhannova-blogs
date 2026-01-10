-- Create storage bucket for blog thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-thumbnails', 'blog-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view thumbnails
CREATE POLICY "Public Access to Thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-thumbnails');

-- Allow authenticated uploads (we'll handle auth in API)
CREATE POLICY "Allow Thumbnail Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-thumbnails');

-- Allow updates and deletes
CREATE POLICY "Allow Thumbnail Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-thumbnails');

CREATE POLICY "Allow Thumbnail Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-thumbnails');
