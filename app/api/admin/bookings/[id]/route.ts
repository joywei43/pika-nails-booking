// app/api/admin/bookings/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// 給 TypeScript 用的型別
type RouteParams = { id: string };

export async function PATCH(
  req: Request,
  context: { params: RouteParams } | { params: Promise<RouteParams> }
) {
  try {
    // 👉 這裡處理「params 可能是 Promise」的情況
    const rawParams = (context as any).params;
    const resolvedParams: RouteParams =
      typeof rawParams?.then === 'function'
        ? await rawParams
        : rawParams;

    const { id } = resolvedParams || {};

    if (!id) {
      return NextResponse.json(
        { error: '缺少預約 ID（id 為 undefined）' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body as { status?: string };

    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return NextResponse.json(
        { error: '不合法的狀態' },
        { status: 400 }
      );
    }

    // 用 service role 更新 bookings.status
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: error.message || 'Supabase 更新失敗' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Update booking status error:', err);
    return NextResponse.json(
      { error: err.message || '更新預約狀態失敗' },
      { status: 500 }
    );
  }
}
