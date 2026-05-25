-- Create the salon-images storage bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'salon-images',
  'salon-images',
  true,
  5242880,  -- 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow any authenticated user to upload
CREATE POLICY "Authenticated users can upload salon images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'salon-images');

-- Allow public read
CREATE POLICY "Public read on salon images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'salon-images');

-- Allow owner to update/delete their own uploads (path starts with salones/{user.id}/)
CREATE POLICY "Owner can update salon images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'salon-images' AND (storage.foldername(name))[1] = 'salones' AND (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "Owner can delete salon images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'salon-images' AND (storage.foldername(name))[1] = 'salones' AND (storage.foldername(name))[2] = auth.uid()::text);
