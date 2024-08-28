-- Create the database
CREATE DATABASE hodlinfo;

-- Connect to the database
\c hodlinfo

-- Create the tickers table
CREATE TABLE tickers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  last DECIMAL(18, 8) NOT NULL,
  buy DECIMAL(18, 8) NOT NULL,
  sell DECIMAL(18, 8) NOT NULL,
  volume DECIMAL(18, 8) NOT NULL,
  base_unit VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the name column for faster lookups
CREATE INDEX idx_tickers_name ON tickers(name);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_tickers_modtime
BEFORE UPDATE ON tickers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();