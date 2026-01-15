-- EXTENDED SCHEMA FOR VISATRACK MALTA
-- This migration updates the initial schema to match the comprehensive README requirements.

-- 1. Update COMPANIES table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS registration_number TEXT UNIQUE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'starter';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employees_limit INTEGER DEFAULT 50;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update PROFILES (USERS) table
-- We'll rename profiles to users if it makes sense, but profiles is a common Supabase convention.
-- Let's stick with profiles but add the fields.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Update EMPLOYEES table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS passport_expiry DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_start_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_end_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Update status constraints if necessary
-- Current check might be 'active', 'inactive', 'terminated'. README says 'active', 'pending', 'inactive', 'on_leave'.

-- 4. Update VISAS table
ALTER TABLE visas ADD COLUMN IF NOT EXISTS country_issued TEXT;
ALTER TABLE visas ADD COLUMN IF NOT EXISTS permit_number TEXT UNIQUE;
ALTER TABLE visas ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'valid';
ALTER TABLE visas ADD COLUMN IF NOT EXISTS renewal_reminder_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE visas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Update DOCUMENTS table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE documents RENAME COLUMN uploaded_at TO upload_date;

-- 6. Create COMPLIANCE_ALERTS table
CREATE TABLE IF NOT EXISTS compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  employee_id UUID REFERENCES employees(id),
  alert_type VARCHAR(50) NOT NULL, -- 'expiry', 'missing_document', 'status_change'
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'acknowledged', 'resolved'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create AUDIT_LOGS table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES profiles(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50), -- 'create', 'update', 'delete', 'download'
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for compliance_alerts
CREATE POLICY "Users view company alerts" ON compliance_alerts
  FOR SELECT USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Policies for audit_logs
CREATE POLICY "Admins view audit logs" ON audit_logs
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_visas_updated_at BEFORE UPDATE ON visas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_compliance_alerts_updated_at BEFORE UPDATE ON compliance_alerts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
