import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const WAITLIST_SOURCE = "Landing Page";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSupabaseServerClient() {
  return createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SECRET_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("waitlist")
      .upsert(
        {
          email,
          source: WAITLIST_SOURCE,
        },
        {
          onConflict: "email",
          ignoreDuplicates: true,
        },
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save waitlist email." }, { status: 500 });
  }
}
