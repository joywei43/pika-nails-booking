import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { pushLineMessage } from '@/lib/line'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    // 1️⃣ 更新預約狀態（例如：admin 已確認）
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('update booking error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2️⃣ 如果狀態是「confirmed」，就推 LINE 訊息給客人
    if (body.status === 'confirmed' && data.line_user_id) {
      await pushLineMessage(
        data.line_user_id,
        `✨ 您的預約已確認成功！\n\n日期：${data.date}\n時間：${data.time}\n\n如需更改請回覆我們 🙏`
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('PATCH /admin/bookings/[id] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Server error' },
      { status: 500 }
    )
  }
}
