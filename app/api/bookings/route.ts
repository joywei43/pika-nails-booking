import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lineName, phone, date, time, style, needRemoval } = body;

    if (!lineName || !date || !time || !style) {
      return NextResponse.json(
        { error: '缺少必填欄位' },
        { status: 400 }
      );
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('line_name', lineName)
      .maybeSingle();

    if (findError) throw findError;

    let customerId = existing?.id;

    if (!customerId) {
      const { data: created, error: createCustomerError } = await supabaseAdmin
        .from('customers')
        .insert({
          line_name: lineName,
          phone,
        })
        .select()
        .single();

      if (createCustomerError) throw createCustomerError;
      customerId = created.id;
    }

    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id: customerId,
        date,
        time,
        style,
        need_removal: needRemoval,
        status: 'pending',
      });

    if (bookingError) throw bookingError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Create booking error', err);
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
