import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

        // Get alerts for this company
        const { data: alerts, error } = await supabase
            .from("compliance_alerts")
            .select("*")
            .eq("company_id", profile.company_id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Get employee info for alerts that have employee_id
        const employeeIds = Array.from(new Set(alerts?.filter(a => a.employee_id).map(a => a.employee_id)));

        let employees: any[] = [];
        if (employeeIds.length > 0) {
            const { data } = await supabase
                .from("employees")
                .select("id, first_name, last_name")
                .in("id", employeeIds);
            employees = data || [];
        }

        // Attach employee info to alerts
        const alertsWithEmployees = alerts?.map((alert) => ({
            ...alert,
            employee: employees.find((e) => e.id === alert.employee_id),
        }));

        return NextResponse.json(alertsWithEmployees || []);
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

        const { data: profile } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", session.user.id)
            .single();

        if (!profile?.company_id) {
            return NextResponse.json({ error: "No company" }, { status: 403 });
        }

        const body = await request.json();

        const { data: alert, error } = await supabase
            .from("compliance_alerts")
            .insert({
                company_id: profile.company_id,
                employee_id: body.employee_id,
                alert_type: body.alert_type || "expiry",
                title: body.title,
                description: body.description,
                due_date: body.due_date,
                status: "open",
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(alert, { status: 201 });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
