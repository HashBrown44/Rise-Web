import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, type LeadFormValues } from "@/lib/schemas";

const PACKAGE_LABELS: Record<LeadFormValues["package"], string> = {
  "full-ownership": "Full Ownership — $799",
  "growth-plan": "Growth Plan — $499 + $99.99/mo",
  "not-sure": "Not sure yet",
};

function buildEmailText(data: LeadFormValues) {
  return [
    `New lead from risewebsite.com`,
    ``,
    `Name: ${data.fullName}`,
    `Business: ${data.businessName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Website: ${data.websiteUrl || "—"}`,
    `Package: ${PACKAGE_LABELS[data.package]}`,
    ``,
    `Project description:`,
    data.projectDescription,
  ].join("\n");
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = leadFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ ok: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  console.log("[lead] new submission", result.data);

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.error(
      "[lead] email not sent — missing RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL in environment.",
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { data } = result;
    const { error } = await resend.emails.send({
      from: "Rise Web Leads <leads@risewebsite.com>",
      to: notifyEmail,
      replyTo: data.email,
      subject: `New lead: ${data.businessName} (${PACKAGE_LABELS[data.package]})`,
      text: buildEmailText(data),
    });

    if (error) {
      console.error("[lead] Resend API error", error);
    }
  } catch (error) {
    console.error("[lead] failed to send notification email", error);
  }

  return NextResponse.json({ ok: true });
}
