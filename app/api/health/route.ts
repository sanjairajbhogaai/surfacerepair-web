import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    data: { ok: true, db: 'not_configured', time: new Date().toISOString() },
  });
}
