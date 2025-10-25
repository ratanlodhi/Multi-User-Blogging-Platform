/*
  # Create Blog Platform Schema

  ## Tables
  
  ### posts
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `content` (text, markdown format, required)
  - `slug` (text, unique, required)
  - `status` (enum: draft|published, default: draft)
  - `created_at` (timestamp, default: now)
  - `updated_at` (timestamp, default: now)
  
  ### categories
  - `id` (uuid, primary key)
  - `name` (text, required)
  - `description` (text, optional)
  - `slug` (text, unique, required)
  - `created_at` (timestamp, default: now)
  
  ### post_categories (join table)
  - `post_id` (uuid, foreign key to posts)
  - `category_id` (uuid, foreign key to categories)
  - Composite primary key on (post_id, category_id)
  
  ## Security
  - Enable RLS on all tables
  - Add policies for public read access to published posts
  - Add policies for full access (for MVP, will be restricted later with auth)
*/

-- Create enum for post status
DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  slug text NOT NULL UNIQUE,
  status post_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create post_categories join table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS post_categories_post_id_idx ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS post_categories_category_id_idx ON post_categories(category_id);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Anyone can view all posts (MVP)"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert posts (MVP)"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts (MVP)"
  ON posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete posts (MVP)"
  ON posts FOR DELETE
  USING (true);

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert categories (MVP)"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories (MVP)"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories (MVP)"
  ON categories FOR DELETE
  USING (true);

-- RLS Policies for post_categories
CREATE POLICY "Anyone can view post-category relationships"
  ON post_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert post-category relationships (MVP)"
  ON post_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete post-category relationships (MVP)"
  ON post_categories FOR DELETE
  USING (true);
