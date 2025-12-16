import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: '缺少 booking id' }, { status: 400 });
    }

    if (status !== 'confirmed') {
      return NextResponse.json({ error: '只處理 confirmed 狀態' }, { status: 400 });
    }

    // 1️⃣ 更新 booking 狀態
    const { data: booking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !booking) {
      return NextResponse.json({ error: '更新失敗' }, { status: 500 });
    }

    // 2️⃣ 取得 LINE userId
    const lineUserId = booking.line_user_id;
    if (!lineUserId) {
      return NextResponse.json({ error: '找不到 LINE user id' }, { status: 400 });
    }

    // 3️⃣ 推播 LINE 訊息
    await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text: '✅ 您的美甲預約已確認成功，期待為您服務 💅',
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
