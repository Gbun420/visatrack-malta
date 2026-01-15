-- Enable RLS
alter table auth.users enable row level security;

-- 1. COMPANIES
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tcn_threshold int default 0,
  created_at timestamptz default now()
);

-- 2. PROFILES (Users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id),
  role text check (role in ('admin', 'editor', 'viewer')),
  first_name text,
  last_name text
);

-- 3. EMPLOYEES
create table employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  first_name text not null,
  last_name text not null,
  passport_number text not null,
  nationality text not null,
  department text,
  position text,
  status text default 'active',
  created_at timestamptz default now()
);

-- 4. VISAS
create table visas (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  visa_type text not null,
  issue_date date,
  expiry_date date not null,
  application_status text default 'active',
  created_at timestamptz default now()
);

-- 5. DOCUMENTS
create table documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  file_url text not null,
  document_type text not null,
  uploaded_at timestamptz default now()
);

-- RLS POLICIES (Simplified for Starter)
alter table companies enable row level security;
alter table employees enable row level security;
alter table visas enable row level security;

create policy "Users view their own company employees"
on employees for select
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);
