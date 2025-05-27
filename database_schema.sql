-- Danang Lover Database Schema
-- Run this SQL in your Supabase database to create the required tables

-- Enable RLS (Row Level Security) 
-- This should be done in Supabase dashboard

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Place types table
CREATE TABLE IF NOT EXISTS place_type (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Insert default place types
INSERT INTO place_type (name, description) VALUES 
  ('Coffee Shop', 'Cafes and coffee shops'),
  ('Restaurant', 'Restaurants and eateries'),
  ('Checkin', 'Tourist attractions and check-in spots')
ON CONFLICT (name) DO NOTHING;

-- Places table
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  "placeTypeId" UUID REFERENCES place_type(id),
  location TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  "reviewsCount" INTEGER DEFAULT 0,
  "userId" UUID REFERENCES users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "placeId" UUID REFERENCES places(id) ON DELETE CASCADE,
  "userId" UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "placeId" UUID REFERENCES places(id) ON DELETE CASCADE,
  "userId" UUID REFERENCES users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("placeId", "userId")
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  "userId" UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  "publishedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "blogPostId" UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  "userId" UUID REFERENCES users(id),
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets (run these in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('place-photos', 'place-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Places policies
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view places" ON places FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create places" ON places FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own places" ON places FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own places" ON places FOR DELETE USING (auth.uid() = "userId");

-- Reviews policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = "userId");

-- Favorites policies
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = "userId");

-- Blog posts policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (published = true OR auth.uid() = "userId");
CREATE POLICY "Authenticated users can create posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own posts" ON blog_posts FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own posts" ON blog_posts FOR DELETE USING (auth.uid() = "userId");

-- Comments policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = "userId");

-- Place types policies
ALTER TABLE place_type ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view place types" ON place_type FOR SELECT USING (true); 