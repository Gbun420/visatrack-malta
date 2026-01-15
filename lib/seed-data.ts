import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function seedDemoData() {
  console.log('🌱 Starting seed process...');

  try {
    // 1. Get or Create a Demo Company
    const { data: existingCompanies } = await supabaseAdmin
      .from('companies')
      .select('id')
      .limit(1);

    let companyId: string;

    if (existingCompanies && existingCompanies.length > 0) {
      companyId = existingCompanies[0].id;
      console.log(`🏢 Using existing company: ${companyId}`);
    } else {
      console.log('🏢 Creating new Demo Company...');
      const { data: newCompany, error: companyError } = await supabaseAdmin
        .from('companies')
        .insert({
          name: 'Malta Tech Solutions Ltd',
          registration_number: 'C12345',
          email: 'hr@maltatech.com',
          subscription_tier: 'professional'
        })
        .select()
        .single();

      if (companyError) throw new Error(`Failed to create company: ${companyError.message}`);
      companyId = newCompany.id;
    }

    // 2. Define Sample Employees (Malta Context)
    const today = new Date();
    
    // Helper to format dates YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    const addDays = (days: number) => {
      const result = new Date(today);
      result.setDate(result.getDate() + days);
      return formatDate(result);
    };

    const employees = [
      {
        // Active - Valid Visa
        first_name: 'Maria',
        last_name: 'Santos',
        nationality: 'Philippines',
        passport_number: 'P8291032A',
        position: 'Senior Nurse',
        department: 'Healthcare',
        status: 'active',
        visa: {
          visa_type: 'Single Permit',
          issue_date: addDays(-200),
          expiry_date: addDays(165), // Valid
          status: 'valid'
        }
      },
      {
        // Active - Expiring Soon (Critical)
        first_name: 'Rahul',
        last_name: 'Sharma',
        nationality: 'India',
        passport_number: 'Z1234567',
        position: 'Backend Developer',
        department: 'Engineering',
        status: 'active',
        visa: {
          visa_type: 'Key Employee',
          issue_date: addDays(-300),
          expiry_date: addDays(45), // Expiring < 90 days
          status: 'valid'
        }
      },
      {
        // Active - Expiring Very Soon
        first_name: 'Sofia',
        last_name: 'Petrova',
        nationality: 'Russia',
        passport_number: '750281923',
        position: 'Marketing Specialist',
        department: 'Marketing',
        status: 'active',
        visa: {
          visa_type: 'Specialist Employee',
          issue_date: addDays(-350),
          expiry_date: addDays(10), // Expiring < 90 days
          status: 'valid'
        }
      },
      {
        // Expired - Compliance Alert
        first_name: 'Arjun',
        last_name: 'Singh',
        nationality: 'Nepal',
        passport_number: 'N0987654',
        position: 'Construction Supervisor',
        department: 'Operations',
        status: 'active', // Still marked active but visa expired
        visa: {
          visa_type: 'Single Permit',
          issue_date: addDays(-400),
          expiry_date: addDays(-5), // Expired
          status: 'expired'
        }
      },
      {
        // New Hire - Valid
        first_name: 'Hassan',
        last_name: 'Ali',
        nationality: 'Pakistan',
        passport_number: 'PK998877',
        position: 'Delivery Coordinator',
        department: 'Logistics',
        status: 'active',
        visa: {
          visa_type: 'Single Permit',
          issue_date: addDays(-30),
          expiry_date: addDays(330), // Valid
          status: 'valid'
        }
      }
    ];

    console.log('👥 Seeding 5 employees...');

    for (const emp of employees) {
      // Insert Employee
      const { data: empData, error: empError } = await supabaseAdmin
        .from('employees')
        .insert({
          company_id: companyId,
          first_name: emp.first_name,
          last_name: emp.last_name,
          nationality: emp.nationality,
          passport_number: emp.passport_number,
          position: emp.position,
          department: emp.department,
          status: emp.status,
          email: `${emp.first_name.toLowerCase()}.${emp.last_name.toLowerCase()}@example.com`
        })
        .select()
        .single();

      if (empError) {
        console.error(`Error adding employee ${emp.first_name}: ${empError.message}`);
        continue;
      }

      // Insert Visa
      const { error: visaError } = await supabaseAdmin
        .from('visas')
        .insert({
          employee_id: empData.id,
          visa_type: emp.visa.visa_type,
          issue_date: emp.visa.issue_date,
          expiry_date: emp.visa.expiry_date,
          status: emp.visa.status,
          country_issued: 'Malta',
          permit_number: `MT-${Math.floor(Math.random() * 100000)}`
        });

      if (visaError) {
        console.error(`Error adding visa for ${emp.first_name}: ${visaError.message}`);
      }
    }

    console.log('✅ Seeding completed successfully.');
    return { success: true, message: 'Seeding completed' };

  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    return { success: false, message: error.message };
  }
}