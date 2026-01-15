-- VisaTrack Malta Database Schema
-- Comprehensive database schema for TCN compliance and visa management
-- Created for Supabase PostgreSQL 17

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- COMPANIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  subscription_tier VARCHAR(20) DEFAULT 'starter',
  employees_limit INTEGER DEFAULT 50,
  storage_gb INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  CONSTRAINT subscription_tier_check CHECK (subscription_tier IN ('starter', 'professional', 'enterprise'))
);

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer',
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT role_check CHECK (role IN ('admin', 'manager', 'viewer'))
);

-- ============================================================
-- EMPLOYEES TABLE (TCN Workers)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT UNIQUE,
  passport_expiry DATE,
  date_of_birth DATE,
  gender VARCHAR(10),
  position TEXT,
  department TEXT,
  employment_start_date DATE NOT NULL,
  employment_end_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT employment_status_check CHECK (status IN ('active', 'pending', 'inactive', 'on_leave', 'terminated'))
);

-- ============================================================
-- VISAS TABLE (Work Permits & Residence Permits)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  visa_type VARCHAR(50) NOT NULL,
  country_issued TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  permit_number TEXT UNIQUE,
  status VARCHAR(20) DEFAULT 'valid',
  renewal_reminder_sent BOOLEAN DEFAULT FALSE,
  renewal_reminder_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT visa_type_check CHECK (visa_type IN ('work_permit', 'residence_permit', 'schengen', 'visa', 'identity_card')),
  CONSTRAINT visa_status_check CHECK (status IN ('valid', 'expired', 'pending_renewal', 'renewal_requested', 'rejected'))
);

-- ============================================================
-- DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  upload_date TIMESTAMP DEFAULT NOW(),
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT document_type_check CHECK (document_type IN ('passport', 'visa', 'work_permit', 'residence_permit', 'identity_card', 'employment_contract', 'other'))
);

-- ============================================================
-- COMPLIANCE ALERTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compliance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  visa_id UUID REFERENCES public.visas(id) ON DELETE SET NULL,
  alert_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  acknowledged_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMP,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT alert_type_check CHECK (alert_type IN ('expiry', 'missing_document', 'status_change', 'verification_needed', 'renewal_required')),
  CONSTRAINT alert_status_check CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'closed')),
  CONSTRAINT priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT action_check CHECK (action IN ('create', 'update', 'delete', 'download', 'upload', 'verify', 'acknowledge', 'resolve'))
);

-- ============================================================
-- EMAIL NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  notification_type VARCHAR(50),
  related_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  sent_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT notification_status_check CHECK (status IN ('pending', 'sent', 'failed', 'bounced'))
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Companies indexes
CREATE INDEX idx_companies_subscription_tier ON public.companies(subscription_tier);
CREATE INDEX idx_companies_is_active ON public.companies(is_active);

-- Users indexes
CREATE INDEX idx_users_company_id ON public.users(company_id);
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_active ON public.users(is_active);

-- Employees indexes
CREATE INDEX idx_employees_company_id ON public.employees(company_id);
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employees_passport_number ON public.employees(passport_number);

-- Visas indexes
CREATE INDEX idx_visas_employee_id ON public.visas(employee_id);
CREATE INDEX idx_visas_expiry_date ON public.visas(expiry_date);
CREATE INDEX idx_visas_status ON public.visas(status);
CREATE INDEX idx_visas_permit_number ON public.visas(permit_number);

-- Documents indexes
CREATE INDEX idx_documents_employee_id ON public.documents(employee_id);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_documents_expiry_date ON public.documents(expiry_date);
CREATE INDEX idx_documents_is_verified ON public.documents(is_verified);

-- Compliance alerts indexes
CREATE INDEX idx_alerts_company_id ON public.compliance_alerts(company_id);
CREATE INDEX idx_alerts_employee_id ON public.compliance_alerts(employee_id);
CREATE INDEX idx_alerts_status ON public.compliance_alerts(status);
CREATE INDEX idx_alerts_priority ON public.compliance_alerts(priority);
CREATE INDEX idx_alerts_due_date ON public.compliance_alerts(due_date);
CREATE INDEX idx_alerts_alert_type ON public.compliance_alerts(alert_type);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_company_id ON public.audit_logs(company_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Email notifications indexes
CREATE INDEX idx_email_notifications_status ON public.email_notifications(status);
CREATE INDEX idx_email_notifications_recipient_id ON public.email_notifications(recipient_id);
CREATE INDEX idx_email_notifications_created_at ON public.email_notifications(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- UPDATED AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_visas_updated_at
BEFORE UPDATE ON public.visas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.compliance_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_audit_logs_updated_at
BEFORE UPDATE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
