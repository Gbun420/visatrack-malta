import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const visaSchema = z.object({
    employee_id: z.string().uuid(),
    visa_type: z.string().min(1),
    permit_number: z.string().optional(),
    issue_date: z.string(),
    expiry_date: z.string(),
    country_issued: z.string().optional(),
    status: z.enum(["valid", "expired", "pending_renewal"]).optional(),
});

export async function GET(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json([]);
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", session.user.id)
            .single();

        if (!profile?.company_id) {
            return NextResponse.json([]);
        }

        // Get all employees for this company first
        const { data: employees } = await supabase
            .from("employees")
            .select("id, first_name, last_name, passport_number")
            .eq("company_id", profile.company_id);

        if (!employees || employees.length === 0) {
            return NextResponse.json([]);
        }

        const employeeIds = employees.map((e) => e.id);

        // Get all visas for these employees
        const { data: visas, error } = await supabase
            .from("visas")
            .select("*")
            .in("employee_id", employeeIds)
            .order("expiry_date", { ascending: true });

        if (error) throw error;

        // Attach employee info to each visa
        const visasWithEmployees = visas?.map((visa) => ({
            ...visa,
            employee: employees.find((e) => e.id === visa.employee_id),
        }));

        return NextResponse.json(visasWithEmployees || []);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validation = visaSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error, { status: 400 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", session.user.id)
            .single();

        if (!profile?.company_id) {
            return NextResponse.json({ error: "No company" }, { status: 403 });
        }

        // Verify employee belongs to company
        const { data: employee } = await supabase
            .from("employees")
            .select("id")
            .eq("id", validation.data.employee_id)
            .eq("company_id", profile.company_id)
            .single();

        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }

        const { data: visa, error } = await supabase
            .from("visas")
            .insert({
                ...validation.data,
                status: validation.data.status || "valid",
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(visa, { status: 201 });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
