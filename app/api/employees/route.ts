import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('[API] Initializing Supabase client...');
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    console.log('[API] Supabase client initialized.');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    // 1. Authentication
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[API] Auth Session Error:', sessionError.message);
      return NextResponse.json({ error: `Authentication error: ${sessionError.message}` }, { status: 401 });
    }

    if (!session) {
      console.warn('[API] No active session found.');
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    console.log(`[API] Fetching profile for user: ${session.user.id}`);

    // 2. Authorization: Get user's company_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('[API] Profile Fetch Error:', profileError.message);
      
      // Check if profiles table doesn't exist
      if (profileError.code === '42P01') {
        console.warn('[API] Fallback: Profiles table does not exist. Check migrations.');
        return NextResponse.json({ 
          error: 'Database table "profiles" missing. Did you run the Supabase migrations?',
          fallback: true 
        }, { status: 500 });
      }

      return NextResponse.json(
        { error: `Authorization error: ${profileError.message}` },
        { status: 403 }
      );
    }

    if (!profile?.company_id) {
      console.warn(`[API] No company_id found for user ${session.user.id}`);
      return NextResponse.json(
        { error: 'User is not associated with any company profile.' },
        { status: 403 }
      );
    }

    console.log(`[API] Executing query for company: ${profile.company_id}`);

    // 3. Data Fetching
    let query = supabase
      .from('employees')
      .select('*, visas(*)')
      .eq('company_id', profile.company_id);

    // 5. Search/Filter
    if (search) {
      console.log(`[API] Applying search filter: "${search}"`);
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,passport_number.ilike.%${search}%`
      );
    }

    const { data: employees, error: employeesError } = await query;

    if (employeesError) {
      console.error('[API] Employee Fetch Error:', employeesError.message);
      console.error('[API] Error Code:', employeesError.code);

      // Handle missing "employees" table (42P01 = relation does not exist)
      if (employeesError.code === '42P01') {
        console.warn('[API] Fallback: Employees table does not exist. Returning empty array with warning.');
        return NextResponse.json([], {
          headers: {
            'X-Warning': 'Database table "employees" missing. Migrations required.',
          },
        });
      }

      return NextResponse.json(
        { error: `Database error: ${employeesError.message}` },
        { status: 500 }
      );
    }

        console.log(`[API] Successfully retrieved ${employees?.length || 0} employees.`);

        return NextResponse.json(employees);

      } catch (error: any) {

        console.error('[API] Unexpected Server Error:', error);

        return NextResponse.json(

          { 

            error: 'An unexpected internal server error occurred.',

            details: error?.message || 'No additional details available'

          },

          { status: 500 }

        );

      }

    }

    

    export async function POST(request: Request) {

      try {

        const supabase = createRouteHandlerClient({ cookies });

        const body = await request.json();

    

        // 1. Authentication

        const {

          data: { session },

        } = await supabase.auth.getSession();

    

        if (!session) {

          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        }

    

        // 2. Authorization: Get user's company_id

        const { data: profile, error: profileError } = await supabase

          .from('profiles')

          .select('company_id')

          .eq('id', session.user.id)

          .single();

    

        if (profileError || !profile?.company_id) {

          return NextResponse.json(

            { error: 'Company profile not found' },

            { status: 403 }

          );

        }

    

        // 3. Insert Employee

        const { data: employee, error: employeeError } = await supabase

          .from('employees')

          .insert({

            company_id: profile.company_id,

            first_name: body.first_name,

            last_name: body.last_name,

            email: body.email,

            phone: body.phone,

            passport_number: body.passport_number,

            nationality: body.nationality,

            position: body.position,

            department: body.department,

            status: 'active',

            // Handling optional dates correctly

            employment_start_date: body.employment_start_date || null,

            passport_expiry: body.passport_expiry || null

          })

          .select()

          .single();

    

        if (employeeError) {

          console.error('Error creating employee:', employeeError);

          return NextResponse.json(

            { error: `Failed to create employee: ${employeeError.message}` },

            { status: 500 }

          );

        }

    

        return NextResponse.json(employee);

      } catch (error: any) {

        console.error('Server error:', error);

        return NextResponse.json(

          { error: 'Internal Server Error' },

          { status: 500 }

        );

      }

    }

    