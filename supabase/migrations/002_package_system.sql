-- =============================================
-- 002: Package System
-- =============================================

-- profiles tablosuna paket ve rol alanları ekle
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer_user'
    CHECK (role IN ('super_admin', 'customer_user')),
  ADD COLUMN IF NOT EXISTS package_type TEXT NOT NULL DEFAULT 'pack1'
    CHECK (package_type IN ('pack1', 'pack2', 'pack3')),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS package_started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS package_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Mevcut kullanıcılar için package_started_at güncelle (null ise)
UPDATE profiles
  SET package_started_at = created_at
  WHERE package_started_at IS NULL;

-- Trigger: package_type değişince package_updated_at güncelle
CREATE OR REPLACE FUNCTION update_package_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.package_type IS DISTINCT FROM NEW.package_type THEN
    NEW.package_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_package_timestamps_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_package_timestamps();

-- handle_new_user trigger'ını güncelle: paket alanlarını da ekle
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    package_type,
    is_active,
    package_started_at,
    package_updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Emlakçı'),
    'customer_user',
    'pack1',
    TRUE,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- super_admin için RLS bypass politikası
CREATE POLICY "super_admin_all_profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );
