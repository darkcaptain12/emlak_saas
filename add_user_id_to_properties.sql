-- Add user_id column to properties table
ALTER TABLE properties
ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key constraint
ALTER TABLE properties
ADD CONSTRAINT fk_properties_user_id
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_properties_user_id ON properties(user_id);

-- Enable Row Level Security if not already enabled
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to only see their own properties
CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy to allow users to insert their own properties
CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow users to update their own properties
CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow users to delete their own properties
CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
