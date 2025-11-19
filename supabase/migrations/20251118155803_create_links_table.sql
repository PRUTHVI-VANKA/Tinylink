/*
  # Create URL Shortener Links Table

  1. New Tables
    - `links`
      - `id` (uuid, primary key) - Unique identifier for each link
      - `code` (text, unique, not null) - Short code for the URL (6-8 chars, alphanumeric)
      - `target_url` (text, not null) - Original URL to redirect to
      - `click_count` (integer, default 0) - Number of times the link has been clicked
      - `last_clicked_at` (timestamptz, nullable) - Timestamp of last click
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp
      - `is_deleted` (boolean, default false) - Soft delete flag

  2. Security
    - Enable RLS on `links` table
    - Add policy for anonymous users to read non-deleted links (for redirect)
    - Add policy for anonymous users to insert links (for creating short links)
    - Add policy for anonymous users to update click stats
    - Add policy for anonymous users to soft delete links

  3. Indexes
    - Unique index on `code` where not deleted
    - Index on `is_deleted` for efficient queries
    - Index on `created_at` for sorting
*/

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  target_url text NOT NULL,
  click_count integer DEFAULT 0 NOT NULL,
  last_clicked_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  is_deleted boolean DEFAULT false NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS links_code_unique_idx ON links(code) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS links_is_deleted_idx ON links(is_deleted);
CREATE INDEX IF NOT EXISTS links_created_at_idx ON links(created_at DESC);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read non-deleted links"
  ON links FOR SELECT
  USING (is_deleted = false);

CREATE POLICY "Anyone can insert links"
  ON links FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update links for click tracking"
  ON links FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can soft delete links"
  ON links FOR DELETE
  USING (true);