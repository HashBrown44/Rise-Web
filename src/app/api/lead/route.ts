import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const result = leadFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ ok: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  // TODO: connect to CRM / email notification (e.g. Resend, HubSpot, Airtable)
  // using LEAD_NOTIFICATION_EMAIL and the validated `result.data` payload.
  console.log("[lead] new submission", result.data);

  return NextResponse.json({ ok: true });
}
