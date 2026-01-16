import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { differenceInDays, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

const employeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  passport_number: z.string().min(1),
  passport_expiry: z.string().optional().nullable(),
  nationality: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  employment_start_date: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json([]); // Return empty for MVP testing
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.company_id) return NextResponse.json([]);

    // Query employees with visas
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*, visas(*)')
      .eq('company_id', profile.company_id);

    if (error) throw error;

    // Post-process: Calculate days_until_expiry and Order (Prompt 3)
    const processedEmployees = employees.map(emp => {
      const visas = emp.visas || [];
      const activeVisa = visas.find((v: any) => v.status === 'valid' || v.status === 'active');
      
      let days_until_expiry = null;
      if (activeVisa?.expiry_date) {
        days_until_expiry = differenceInDays(parseISO(activeVisa.expiry_date), new Date());
      }

      return { ...emp, days_until_expiry };
    }).sort((a, b) => {
      // Order by days_until_expiry (soonest first)
      if (a.days_until_expiry === null) return 1;
      if (b.days_until_expiry === null) return -1;
      return a.days_until_expiry - b.days_until_expiry;
    });

    return NextResponse.json(processedEmployees);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const validation = employeeSchema.safeParse(body);
    if (!validation.success) return NextResponse.json(validation.error, { status: 400 });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.company_id) return NextResponse.json({ error: 'No company' }, { status: 403 });

    const { data: employee, error } = await supabase
      .from('employees')
      .insert({
        ...validation.data,
        company_id: profile.company_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
