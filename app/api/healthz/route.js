// app/api/healthz/route.js
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({ ok: true, version: '1.0' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
