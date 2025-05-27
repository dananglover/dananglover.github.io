-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Places table policies
CREATE POLICY "Places are viewable by everyone"
ON places FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can create their own places"
ON places FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update their own places"
ON places FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete their own places"
ON places FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Blog posts table policies
CREATE POLICY "Published blog posts are viewable by everyone"
ON blog_posts FOR SELECT
TO public
USING (published = true);

CREATE POLICY "Users can view their own unpublished posts"
ON blog_posts FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can create their own blog posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update their own blog posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete their own blog posts"
ON blog_posts FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Reviews table policies
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Comments table policies
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Favorites table policies
CREATE POLICY "Users can view their own favorites"
ON favorites FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can manage their own favorites"
ON favorites FOR ALL
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

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

CREATE POLICY "Users can delete their own place photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'place-photos' AND
  auth.uid() IS NOT NULL
); 