/*
  # Initial Schema Setup for Scheduling Platform

  1. New Tables
    - `business_profiles`
      - Business information and settings
    - `services`
      - Available services/products
    - `schedules`
      - Business operating hours
    - `appointments`
      - Customer bookings
    - `subscriptions`
      - Business subscription plans

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated business owners
    - Add policies for public access to necessary data
*/

-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('silver', 'gold', 'platinum');

-- Create enum for appointment status
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Business Profiles
CREATE TABLE business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  business_name text NOT NULL,
  description text,
  timezone text NOT NULL DEFAULT 'UTC',
  contact_email text NOT NULL,
  contact_phone text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services/Products
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration integer NOT NULL, -- in minutes
  price decimal(10,2) NOT NULL,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business Operating Hours
CREATE TABLE schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, day_of_week)
);

-- Appointments
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status appointment_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  tier subscription_tier NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Business Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON business_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Profiles can only be created by authenticated users"
  ON business_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Profiles can only be updated by their owners"
  ON business_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Services Policies
CREATE POLICY "Services are viewable by everyone"
  ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Services can only be modified by business owners"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE id = services.business_id
      AND owner_id = auth.uid()
    )
  );

-- Schedules Policies
CREATE POLICY "Schedules are viewable by everyone"
  ON schedules
  FOR SELECT
  USING (true);

CREATE POLICY "Schedules can only be modified by business owners"
  ON schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE id = schedules.business_id
      AND owner_id = auth.uid()
    )
  );

-- Appointments Policies
CREATE POLICY "Appointments are viewable by business owners"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE id = appointments.business_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Appointments can be created by anyone"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Subscriptions Policies
CREATE POLICY "Subscriptions are only viewable by business owners"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE id = subscriptions.business_id
      AND owner_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION check_appointment_availability(
  p_business_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if there are any overlapping appointments
  RETURN NOT EXISTS (
    SELECT 1
    FROM appointments
    WHERE business_id = p_business_id
    AND status != 'cancelled'
    AND (
      (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    )
  );
END;
$$;

-- Triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_business_profiles
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_services
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_schedules
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();