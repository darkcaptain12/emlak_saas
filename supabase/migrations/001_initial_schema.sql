-- =============================================
-- EMLAK SaaS - Database Schema
-- =============================================

-- Profiles tablosu (auth.users'ı extend eder)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  agency_name TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Properties (İlanlar)
CREATE TABLE properties (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  property_type  TEXT NOT NULL CHECK (property_type IN ('apartment','house','land','commercial','other')),
  listing_type   TEXT NOT NULL CHECK (listing_type IN ('sale','rent')),
  status         TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','pending','sold','rented','passive')),
  price          NUMERIC(14,2) NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'TRY',
  area_sqm       NUMERIC(8,2),
  rooms          SMALLINT,
  bathrooms      SMALLINT,
  floor          SMALLINT,
  total_floors   SMALLINT,
  address_line   TEXT,
  district       TEXT,
  city           TEXT NOT NULL,
  latitude       NUMERIC(10,7),
  longitude      NUMERIC(10,7),
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX properties_agent_id_idx ON properties(agent_id);
CREATE INDEX properties_status_idx   ON properties(status);

-- Property Images
CREATE TABLE property_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  is_cover     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients (Müşteriler)
CREATE TABLE clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  client_type  TEXT NOT NULL CHECK (client_type IN ('buyer','seller','renter','landlord','other')),
  notes        TEXT,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX clients_agent_id_idx ON clients(agent_id);

-- Leads
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id  UUID REFERENCES properties(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new','contacted','viewing','offer','won','lost')),
  source       TEXT CHECK (source IN ('website','referral','social','portal','walk_in','other')),
  budget_min   NUMERIC(14,2),
  budget_max   NUMERIC(14,2),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_agent_id_idx  ON leads(agent_id);
CREATE INDEX leads_status_idx    ON leads(status);
CREATE INDEX leads_client_id_idx ON leads(client_id);

-- Lead Notes
CREATE TABLE lead_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Trigger: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_properties
  BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Trigger: yeni kullanıcı için profile oluştur
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Emlakçı'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Row Level Security
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());

-- Properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_select_own" ON properties FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "properties_insert_own" ON properties FOR INSERT WITH CHECK (agent_id = auth.uid());
CREATE POLICY "properties_update_own" ON properties FOR UPDATE USING (agent_id = auth.uid());
CREATE POLICY "properties_delete_own" ON properties FOR DELETE USING (agent_id = auth.uid());

-- Property Images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_select" ON property_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.agent_id = auth.uid()));
CREATE POLICY "property_images_insert" ON property_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.agent_id = auth.uid()));
CREATE POLICY "property_images_delete" ON property_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.agent_id = auth.uid()));

-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_select_own" ON clients FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "clients_insert_own" ON clients FOR INSERT WITH CHECK (agent_id = auth.uid());
CREATE POLICY "clients_update_own" ON clients FOR UPDATE USING (agent_id = auth.uid());
CREATE POLICY "clients_delete_own" ON clients FOR DELETE USING (agent_id = auth.uid());

-- Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_select_own" ON leads FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "leads_insert_own" ON leads FOR INSERT WITH CHECK (agent_id = auth.uid());
CREATE POLICY "leads_update_own" ON leads FOR UPDATE USING (agent_id = auth.uid());
CREATE POLICY "leads_delete_own" ON leads FOR DELETE USING (agent_id = auth.uid());

-- Lead Notes
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_notes_select" ON lead_notes FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "lead_notes_insert" ON lead_notes FOR INSERT WITH CHECK (agent_id = auth.uid());
CREATE POLICY "lead_notes_delete" ON lead_notes FOR DELETE USING (agent_id = auth.uid());

-- =============================================
-- Storage: property-images bucket
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "storage_select_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "storage_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "storage_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);
