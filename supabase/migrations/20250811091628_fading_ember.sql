/*
  # Create university excel data table

  1. New Tables
    - `university_excel_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - All university ranking columns as specified
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `university_excel_data` table
    - Add policy for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS university_excel_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  "Index" INTEGER,
  "Rank" INTEGER,
  "Previous Rank" INTEGER,
  "Name" TEXT,
  "Country/Territory" TEXT,
  "Region" TEXT,
  "Size" TEXT,
  "Focus" TEXT,
  "Research" TEXT,
  "Status" TEXT,
  "AR SCORE" DECIMAL,
  "AR RANK" INTEGER,
  "ER SCORE" DECIMAL,
  "ER RANK" INTEGER,
  "FSR SCORE" DECIMAL,
  "FSR RANK" INTEGER,
  "CPF SCORE" DECIMAL,
  "CPF RANK" INTEGER,
  "IFR SCORE" DECIMAL,
  "IFR RANK" INTEGER,
  "ISR SCORE" DECIMAL,
  "ISR RANK" INTEGER,
  "ISD SCORE" DECIMAL,
  "ISD RANK" INTEGER,
  "IRN SCORE" DECIMAL,
  "IRN RANK" INTEGER,
  "EO SCORE" DECIMAL,
  "EO RANK" INTEGER,
  "SUS SCORE" DECIMAL,
  "SUS RANK" INTEGER,
  "Overall SCORE" DECIMAL,
  "Column2" TEXT,
  "Rank_Duplicate" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE university_excel_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own university data"
  ON university_excel_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own university data"
  ON university_excel_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own university data"
  ON university_excel_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own university data"
  ON university_excel_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_university_excel_data_user_id ON university_excel_data(user_id);
CREATE INDEX IF NOT EXISTS idx_university_excel_data_rank ON university_excel_data("Rank");
CREATE INDEX IF NOT EXISTS idx_university_excel_data_name ON university_excel_data("Name");