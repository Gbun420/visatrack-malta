# VisaTrack Malta

**AI-Powered TCN Compliance & Visa Management SaaS for Maltese Employers**

VisaTrack Malta is a comprehensive SaaS platform designed to help Maltese businesses and employers manage Third Country National (TCN) onboarding, visa tracking, document management, and regulatory compliance.

## 🎯 Project Overview

VisaTrack Malta addresses a critical gap in the Maltese market by providing employers with an integrated solution for:

- **Employee Onboarding**: Streamlined TCN onboarding workflows with AI-powered document verification
- **Visa Tracking**: Real-time visa status monitoring and expiry alerts
- **Document Management**: Centralized storage and organization of work permits, residence permits, and identity documents
- **Compliance Monitoring**: Automated alerts for regulatory compliance requirements and renewal deadlines
- **Audit Trail**: Complete audit logs for regulatory inspections and compliance documentation

## ✨ Core Features

### MVP v1.0 Features
- Employee profile management with TCN-specific fields
- Visa and work permit tracking with expiry notifications
- Document storage and management (5GB per company)
- Role-based access control (Admin, HR Manager, Viewer)
- Automated compliance alerts and reminders
- Email notifications for critical dates
- Basic reporting and analytics dashboard

### Future Features (v1.1+)
- AI-powered document classification and metadata extraction
- Integration with Maltese government systems
- Mobile app for on-the-go access
- Advanced analytics and reporting
- Multi-company enterprise features
- API access for third-party integrations

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Next.js 14+ (API routes)
- **Database**: PostgreSQL 17 (via Supabase)
- **ORM**: Prisma or direct SQL with PostgREST
- **Authentication**: Supabase Auth (JWT-based)
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Frontend
- **Framework**: Next.js 14+ (React)
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **PDF Generation**: jsPDF/pdfkit for reports

### DevOps & Infrastructure
- **Hosting**: Vercel (frontend + API)
- **Database**: Supabase (PostgreSQL)
- **Region**: EU (North EU - Stockholm)
- **Monitoring**: Sentry for error tracking
- **CI/CD**: GitHub Actions

## 📋 Database Schema

### Core Tables

```sql
-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  subscription_tier VARCHAR(20), -- 'starter', 'professional', 'enterprise'
  employees_limit INTEGER DEFAULT 50,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Users (Company admins/managers)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role VARCHAR(20), -- 'admin', 'manager', 'viewer'
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Employees (TCN workers)
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  passport_number TEXT UNIQUE,
  passport_expiry DATE,
  date_of_birth DATE,
  position TEXT,
  department TEXT,
  employment_start_date DATE,
  employment_end_date DATE,
  status VARCHAR(20), -- 'active', 'pending', 'inactive', 'on_leave'
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Visa/Work Permits
CREATE TABLE visas (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) NOT NULL,
  visa_type VARCHAR(50), -- 'work_permit', 'residence_permit', 'schengen'
  country_issued TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  permit_number TEXT UNIQUE,
  status VARCHAR(20), -- 'valid', 'expired', 'pending_renewal'
  renewal_reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) NOT NULL,
  document_type VARCHAR(50), -- 'passport', 'visa', 'work_permit', 'identity_card'
  file_name TEXT,
  file_path TEXT, -- Supabase storage path
  file_size INTEGER,
  upload_date TIMESTAMP,
  expiry_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Compliance Alerts
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  employee_id UUID REFERENCES employees(id),
  alert_type VARCHAR(50), -- 'expiry', 'missing_document', 'status_change'
  title TEXT,
  description TEXT,
  due_date DATE,
  status VARCHAR(20), -- 'open', 'acknowledged', 'resolved'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50), -- 'create', 'update', 'delete', 'download'
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 17+ (or Supabase account)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Gbun420/visatrack-malta.git
cd visatrack-malta

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Configure your Supabase connection in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
visatrack-malta/
├── app/                          # Next.js App Router
│   ├── api/                       # API routes
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── companies/             # Company management
│   │   ├── employees/             # Employee CRUD operations
│   │   ├── visas/                 # Visa management
│   │   ├── documents/             # Document upload/management
│   │   └── alerts/                # Compliance alerts
│   ├── dashboard/                 # Dashboard pages
│   ├── employees/                 # Employee management UI
│   ├── documents/                 # Document management UI
│   └── settings/                  # Settings pages
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── forms/                     # Form components
│   ├── dashboard/                 # Dashboard-specific components
│   └── layouts/                   # Layout components
├── lib/
│   ├── supabase/                  # Supabase client setup
│   ├── db/                        # Database queries
│   ├── api/                       # API utilities
│   ├── auth.ts                    # Authentication utilities
│   └── utils.ts                   # General utilities
├── types/
│   └── index.ts                   # TypeScript type definitions
├── public/                        # Static assets
├── styles/                        # Global styles
├── .env.example                   # Environment variables template
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

## 🔌 API Endpoints (MVP)

### Authentication
- `POST /api/auth/register` - Register new company
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Companies
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `GET /api/companies/:id/employees` - List employees

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Visas
- `GET /api/visas/:employeeId` - List visas for employee
- `POST /api/visas` - Add visa/permit
- `PUT /api/visas/:id` - Update visa
- `DELETE /api/visas/:id` - Delete visa

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:employeeId` - List documents
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document

### Alerts & Compliance
- `GET /api/alerts` - List compliance alerts
- `PUT /api/alerts/:id` - Update alert status
- `GET /api/alerts/expiring-soon` - Get upcoming expirations

## 📊 Development Roadmap

### Phase 1: MVP Core (Weeks 1-4)
- ✅ Project setup and infrastructure
- [ ] Database schema and migrations
- [ ] Authentication system
- [ ] Employee management CRUD
- [ ] Visa tracking functionality
- [ ] Document upload and storage
- [ ] Basic dashboard

### Phase 2: Compliance & Alerts (Weeks 5-6)
- [ ] Automated expiry alerts
- [ ] Compliance monitoring system
- [ ] Email notifications
- [ ] Audit logging
- [ ] User role management

### Phase 3: Polish & Testing (Week 7)
- [ ] UI/UX refinements
- [ ] Integration testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation

### Phase 4: Launch (Week 8+)
- [ ] Beta testing with select companies
- [ ] Deployment to production
- [ ] Marketing and outreach
- [ ] Initial customer support

## 🔐 Security

- Row-level security (RLS) policies in PostgreSQL
- JWT-based authentication
- Environment variable encryption
- HTTPS-only API communication
- Rate limiting on API endpoints
- GDPR-compliant data handling
- Regular security audits

## 📝 Development Guidelines

### Code Standards
- Use TypeScript for all code
- Follow ESLint configuration
- Components should be functional and use hooks
- Use shadcn/ui components when possible
- Write meaningful commit messages

### Git Workflow
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Always create pull requests before merging to `main`
- Require code review before merge

### Testing
- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows
- Aim for 80%+ code coverage

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💼 Team

- **Developer**: [Your Name]
- **Country**: Malta
- **Started**: January 2026

## 📞 Support

For issues, questions, or feature requests, please open a GitHub issue.

## 🙏 Acknowledgments

- Built with Next.js, React, and Supabase
- UI components from shadcn/ui
- Inspired by modern SaaS best practices
