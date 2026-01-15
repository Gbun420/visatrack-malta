export type Company = {
  id: string;
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  subscription_tier?: 'starter' | 'professional' | 'enterprise';
  employees_limit?: number;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  company_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'viewer';
  phone?: string;
  created_at: string;
  updated_at: string;
};

export type Employee = {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  nationality?: string;
  passport_number: string;
  passport_expiry?: string;
  date_of_birth?: string;
  position?: string;
  department?: string;
  employment_start_date?: string;
  employment_end_date?: string;
  status: 'active' | 'pending' | 'inactive' | 'on_leave' | 'terminated';
  notes?: string;
  created_at: string;
  updated_at: string;
  visas?: Visa[];
  documents?: Document[];
};

export type Visa = {
  id: string;
  employee_id: string;
  visa_type: string; // 'work_permit', 'residence_permit', 'schengen'
  country_issued?: string;
  issue_date: string;
  expiry_date: string;
  permit_number?: string;
  status: 'valid' | 'expired' | 'pending_renewal';
  application_status?: string; // Kept for compatibility with existing code
  renewal_reminder_sent?: boolean;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  employee_id: string;
  document_type: string; // 'passport', 'visa', 'work_permit', 'identity_card'
  file_name: string;
  file_path: string;
  file_size?: number;
  upload_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
};

export type ComplianceAlert = {
  id: string;
  company_id: string;
  employee_id?: string;
  alert_type: 'expiry' | 'missing_document' | 'status_change';
  title: string;
  description?: string;
  due_date?: string;
  status: 'open' | 'acknowledged' | 'resolved';
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  company_id?: string;
  user_id?: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'download';
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  created_at: string;
};