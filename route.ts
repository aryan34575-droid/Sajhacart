import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Minimal liveness endpoint. It intentionally never returns credentials or internal errors. */
export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return NextResponse.json(
    {
      status: 'ok',
      service: 'sajhacart-web',
      timestamp: new Date().toISOString(),
      mode: supabaseConfigured ? 'backend-configured' : 'preview',
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
