import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(
        `
        id,
        date,
        time,
        style,
        need_removal,
        status,
        created_at,
        customers (
          line_name,
          phone
        )
      `
      )
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ bookings: data });
  } catch (err) {
    console.error('Load bookings error', err);
    return NextResponse.json(
      { error: '載入預約失敗' },
      { status: 500 },
    );
  }
}
