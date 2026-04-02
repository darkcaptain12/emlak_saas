-- Kiralık Yönetim Sistemi (Rental Management System)

-- Helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---

-- 1. Kiralıklar Tablosu (Rentals)
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  agent_id UUID NOT NULL REFERENCES profiles(id),

  -- Kira Kontrat Detayları
  monthly_rent_amount NUMERIC(12,2) NOT NULL CHECK (monthly_rent_amount > 0),
  rent_due_day SMALLINT NOT NULL CHECK (rent_due_day >= 1 AND rent_due_day <= 31),
  start_date DATE NOT NULL,
  end_date DATE,

  -- Durum
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'paused')),
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX rentals_property_id_idx ON rentals(property_id);
CREATE INDEX rentals_tenant_id_idx ON rentals(tenant_id);
CREATE INDEX rentals_agent_id_idx ON rentals(agent_id);
CREATE INDEX rentals_status_idx ON rentals(status);
CREATE INDEX rentals_deleted_at_idx ON rentals(deleted_at) WHERE deleted_at IS NULL;

-- Updated trigger için
CREATE TRIGGER rentals_updated_at BEFORE UPDATE ON rentals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

---

-- 2. Kira Ödemeleri Tablosu (Rental Payments) - Pack2+
CREATE TABLE rental_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,

  due_date DATE NOT NULL,
  paid_date DATE,
  amount_due NUMERIC(12,2) NOT NULL CHECK (amount_due > 0),
  amount_paid NUMERIC(12,2) CHECK (amount_paid IS NULL OR amount_paid > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'late', 'partial')),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX rental_payments_rental_id_idx ON rental_payments(rental_id);
CREATE INDEX rental_payments_due_date_idx ON rental_payments(due_date);
CREATE INDEX rental_payments_status_idx ON rental_payments(status);

CREATE TRIGGER rental_payments_updated_at BEFORE UPDATE ON rental_payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

---

-- 3. Kiralık Belgeler Tablosu (Rental Documents) - Pack3
CREATE TABLE rental_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,

  document_type TEXT NOT NULL CHECK (document_type IN ('lease', 'identification', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INT CHECK (file_size_bytes > 0),
  uploaded_by UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX rental_documents_rental_id_idx ON rental_documents(rental_id);
CREATE INDEX rental_documents_document_type_idx ON rental_documents(document_type);

---

-- 4. Kiralık İletişim Logu Tablosu (Rental Communication Log) - Pack3
CREATE TABLE rental_communication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,

  message TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('note', 'reminder', 'complaint', 'other')),
  logged_by UUID NOT NULL REFERENCES profiles(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX rental_communication_log_rental_id_idx ON rental_communication_log(rental_id);
CREATE INDEX rental_communication_log_message_type_idx ON rental_communication_log(message_type);

---

-- Row Level Security (RLS) Policies

-- rentals table RLS
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own rentals"
  ON rentals FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Users can create rentals"
  ON rentals FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own rentals"
  ON rentals FOR UPDATE
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own rentals"
  ON rentals FOR DELETE
  USING (auth.uid() = agent_id);

---

-- rental_payments table RLS
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see payments for their rentals"
  ON rental_payments FOR SELECT
  USING (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments for their rentals"
  ON rental_payments FOR INSERT
  WITH CHECK (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments for their rentals"
  ON rental_payments FOR UPDATE
  USING (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  )
  WITH CHECK (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

---

-- rental_documents table RLS
ALTER TABLE rental_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see documents for their rentals"
  ON rental_documents FOR SELECT
  USING (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents for their rentals"
  ON rental_documents FOR INSERT
  WITH CHECK (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their documents"
  ON rental_documents FOR DELETE
  USING (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

---

-- rental_communication_log table RLS
ALTER TABLE rental_communication_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see communication logs for their rentals"
  ON rental_communication_log FOR SELECT
  USING (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can add logs to their rentals"
  ON rental_communication_log FOR INSERT
  WITH CHECK (
    rental_id IN (
      SELECT id FROM rentals WHERE agent_id = auth.uid()
    )
    AND auth.uid() = logged_by
  );
