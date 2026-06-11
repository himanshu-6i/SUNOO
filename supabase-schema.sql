-- Run this in your Supabase SQL Editor to create the required tracks table

CREATE TABLE IF NOT EXISTS tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  artist text NOT NULL,
  "coverUrl" text,
  "audioUrl" text NOT NULL,
  genre text,
  duration text,
  plays bigint DEFAULT 0,
  "ownerId" uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  visibility text DEFAULT 'public',
  "createdAt" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: If you get errors below about policies already existing, you can ignore them.
-- Enable Row Level Security
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DO $$ BEGIN
  CREATE POLICY "Public tracks are viewable by everyone."
    ON tracks FOR SELECT
    USING ( visibility = 'public' );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create policy to allow authenticated users to insert their own tracks
DO $$ BEGIN
  CREATE POLICY "Users can insert their own tracks."
    ON tracks FOR INSERT
    WITH CHECK ( auth.uid() = "ownerId" );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create policy to allow users to update their own tracks
DO $$ BEGIN
  CREATE POLICY "Users can update their own tracks."
    ON tracks FOR UPDATE
    USING ( auth.uid() = "ownerId" );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create policy to allow users to delete their own tracks
DO $$ BEGIN
  CREATE POLICY "Users can delete their own tracks."
    ON tracks FOR DELETE
    USING ( auth.uid() = "ownerId" );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
