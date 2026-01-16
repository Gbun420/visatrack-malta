import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
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
            .update({
                status: body.status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", params.id)
            .eq("company_id", profile.company_id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(alert);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
