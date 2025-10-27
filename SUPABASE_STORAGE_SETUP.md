# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for the Danang Lover app to enable photo uploads and fix 404 errors.

## Problem

If you're experiencing 404 errors when viewing place photos, it means the Supabase storage bucket hasn't been created or properly configured.

## Setup Steps

### 1. Create Storage Buckets

Go to your Supabase project dashboard → Storage section and create two buckets:

#### Bucket 1: `place-photos`
- **Name**: `place-photos`
- **Public**: ✅ Yes (make it public so photos can be accessed without authentication)
- **File size limit**: 50MB (or as needed)
- **Allowed MIME types**: `image/*` (or specific: `image/jpeg`, `image/png`, `image/webp`)

#### Bucket 2: `blog-images`
- **Name**: `blog-images`
- **Public**: ✅ Yes
- **File size limit**: 50MB
- **Allowed MIME types**: `image/*`

### 2. Set Up Storage Policies

Run the following SQL in your Supabase SQL Editor to create the necessary policies:

```sql
-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('place-photos', 'place-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for place photos
CREATE POLICY "Place photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'place-photos');

CREATE POLICY "Authenticated users can upload place photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'place-photos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update place photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'place-photos' AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'place-photos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own place photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'place-photos' AND
  auth.uid() IS NOT NULL
);

-- Storage policies for blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.uid() IS NOT NULL
);
```

### 3. Verify Storage Setup

1. **Check if buckets exist**: Go to Storage → Buckets in your Supabase dashboard
2. **Check policies**: Go to Storage → Policies to verify they were created
3. **Test upload**: Try creating or editing a place in the app

## Troubleshooting

### Images still showing 404

1. **Check bucket configuration**:
   - Make sure the bucket is marked as "Public"
   - Verify the bucket name matches: `place-photos` (case-sensitive)

2. **Check file URLs**:
   - The URL format should be: `https://your-project.supabase.co/storage/v1/object/public/place-photos/filename.jpg`
   - If your URLs look different, the bucket might not be public

3. **Clear browser cache**:
   - Sometimes old URLs get cached
   - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

4. **Check browser console**:
   - Open DevTools (F12) and check the Network tab
   - Look for failed image requests
   - Check the error message

### Upload failing

1. **Check authentication**:
   - Make sure you're logged in
   - Try logging out and back in

2. **Check file size**:
   - Ensure photos are under 10MB each (configured in the app)
   - Check the bucket's file size limit in Supabase dashboard

3. **Check CORS** (if accessing from custom domain):
   - Go to Settings → API in Supabase
   - Configure CORS to allow your domain

### Still having issues?

1. Check the browser console for detailed error messages
2. Verify your `.env.local` file has the correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Make sure you've run all the SQL from `database_schema.sql` and `database_policies.sql`

## Quick Test

After setting up, try this in your app:

1. Go to "Places" → "Add New Place"
2. Fill in the form and upload at least one photo
3. Save the place
4. View the place detail page
5. The photo should display without 404 errors

## Next Steps

Once storage is working:
- Photos will be uploaded to Supabase Storage
- They'll be publicly accessible via URLs
- You can manage them in the Supabase dashboard (Storage → place-photos)
- Photos persist even after app rebuilds/deployments

