-- VisaTrack Malta - Row Level Security (RLS) Policies
-- This file sets up security policies for all tables
-- Policies ensure users can only access data from their company

-- ============================================================
-- COMPANIES TABLE - RLS POLICIES
-- ============================================================

-- Allow authenticated users to view their company details
CREATE POLICY "Users can view their own company"
  ON public.companies
  FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM public.users WHERE auth_id = auth.uid()
    )
  );

-- ============================================================
-- USERS TABLE - RLS POLICIES
-- ============================================================

-- Allow users to view users from their company
CREATE POLICY "Users can view company members"
  ON public.users
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE auth_id = auth.uid()
    )
  );

-- Admins can update users in their company
CREATE POLICY "Admins can update company members"
  ON public.users
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- EMPLOYEES TABLE - RLS POLICIES
-- ============================================================

-- Users can view employees from their company
CREATE POLICY "Users can view company employees"
  ON public.employees
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE auth_id = auth.uid()
    )
  );

-- Managers and above can insert employees
CREATE POLICY "Managers can insert employees"
  ON public.employees
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Managers and above can update employees
CREATE POLICY "Managers can update employees"
  ON public.employees
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only admins can delete employees
CREATE POLICY "Admins can delete employees"
  ON public.employees
  FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- VISAS TABLE - RLS POLICIES
-- ============================================================

-- Users can view visas for employees in their company
CREATE POLICY "Users can view company visas"
  ON public.visas
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users WHERE auth_id = auth.uid()
      )
    )
  );

-- Managers can insert visas
CREATE POLICY "Managers can insert visas"
  ON public.visas
  FOR INSERT
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- Managers can update visas
CREATE POLICY "Managers can update visas"
  ON public.visas
  FOR UPDATE
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  )
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- ============================================================
-- DOCUMENTS TABLE - RLS POLICIES
-- ============================================================

-- Users can view documents for employees in their company
CREATE POLICY "Users can view company documents"
  ON public.documents
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users WHERE auth_id = auth.uid()
      )
    )
  );

-- Managers can insert documents
CREATE POLICY "Managers can upload documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- Managers can update documents
CREATE POLICY "Managers can update documents"
  ON public.documents
  FOR UPDATE
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  )
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE company_id IN (
        SELECT company_id FROM public.users 
        WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- ============================================================
-- COMPLIANCE ALERTS TABLE - RLS POLICIES
-- ============================================================

-- Users can view alerts for their company
CREATE POLICY "Users can view company alerts"
  ON public.compliance_alerts
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE auth_id = auth.uid()
    )
  );

-- Managers can update alerts
CREATE POLICY "Managers can update alerts"
  ON public.compliance_alerts
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- ============================================================
-- AUDIT LOGS TABLE - RLS POLICIES
-- ============================================================

-- Users can only view audit logs for their company
CREATE POLICY "Users can view company audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE auth_id = auth.uid()
    )
  );

-- Only system can insert audit logs (disable direct inserts)
CREATE POLICY "Audit logs are system generated"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (FALSE);

-- ============================================================
-- EMAIL NOTIFICATIONS TABLE - RLS POLICIES
-- ============================================================

-- Users can view their own notifications
CREATE POLICY "Users can view their notifications"
  ON public.email_notifications
  FOR SELECT
  USING (
    recipient_id = (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
