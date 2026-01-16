import { createClient } from '@supabase/supabase-js';

export async function seedDemoData() {
  console.log('🌱 Starting seed process (Prompt 4 Mode)...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return { success: false, message: 'Missing Supabase environment variables', employeeCount: 0 };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // 1. Create/Get Demo Company "Malta TechCorp"
    const { data: newCompany, error: companyError } = await supabaseAdmin
      .from('companies')
      .upsert({
        name: 'Malta TechCorp',
        registration_number: 'C99999',
        email: 'hr@maltatechcorp.com',
        city: 'Valletta',
        subscription_tier: 'professional'
      }, { onConflict: 'name' })
      .select()
      .single();

    if (companyError) throw new Error(`Company Error: ${companyError.message}`);
    const companyId = newCompany.id;

    // 2. Define 5 Employees from specific countries
    const today = new Date();
    const formatDate = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const employees = [
      {
        first_name: 'Juan', last_name: 'Dela Cruz', nationality: 'Philippines',
        passport_number: 'PH111111', position: 'Fleet Manager', department: 'Logistics',
        visa: { expiry: 25, type: 'Work Permit', status: 'valid' } // Expiring soon
      },
      {
        first_name: 'Ayesha', last_name: 'Iqbal', nationality: 'Pakistan',
        passport_number: 'PK222222', position: 'Logistics Coordinator', department: 'Logistics',
        visa: { expiry: 20, type: 'Work Permit', status: 'valid' } // Expiring soon
      },
      {
        first_name: 'Raj', last_name: 'Patel', nationality: 'India',
        passport_number: 'IN333333', position: 'Operations Manager', department: 'Operations',
        visa: { expiry: 120, type: 'Key Employee', status: 'valid' } // Valid
      },
      {
        first_name: 'Binod', last_name: 'Thapa', nationality: 'Nepal',
        passport_number: 'NP444444', position: 'Logistics Coordinator', department: 'Logistics',
        visa: { expiry: 100, type: 'Work Permit', status: 'valid' } // Valid
      },
      {
        first_name: 'Farhan', last_name: 'Ahmed', nationality: 'Bangladesh',
        passport_number: 'BD555555', position: 'Administration Lead', department: 'Administration',
        visa: { expiry: -10, type: 'Specialist Employee', status: 'expired' } // Expired
      }
    ];

    let count = 0;
    for (const emp of employees) {
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
          status: 'active',
          email: `${emp.first_name.toLowerCase()}@maltatechcorp.com`
        })
        .select()
        .single();

      if (empError) continue;

      await supabaseAdmin.from('visas').insert({
        employee_id: empData.id,
        visa_type: emp.visa.type,
        issue_date: formatDate(-300),
        expiry_date: formatDate(emp.visa.expiry),
        status: emp.visa.status,
        country_issued: 'Malta'
      });
      count++;
    }

    return { success: true, message: 'Demo data seeded successfully', employeeCount: count };
  } catch (error: any) {
    return { success: false, message: error.message, employeeCount: 0 };
  }
}
