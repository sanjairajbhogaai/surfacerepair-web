import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const time = new Date().toISOString();
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ data: { ok: true, db: 'ok', time } });
  } catch {
    return NextResponse.json(
      { error: { code: 'UNAVAILABLE', message: 'Database unreachable.' } },
      { status: 503 }
    );
  }
}
