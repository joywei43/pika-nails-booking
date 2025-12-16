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
  const bookingId = params.id
  const body = await req.json()

  // 1️⃣ 更新預約狀態
  const { data, error } = await supabase
    .from('bookings')
    .update(body)
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 2️⃣ 只有「審核通過」才送 LINE
  if (body.approved === true && data.line_user_id) {
    try {
      await pushLineMessage(
        data.line_user_id,
        `✨ 您在 PIKA NAILS 的預約已確認成功！\n\n日期：${data.date}\n時間：${data.time}\n\n期待為您服務 💅`
      )
    } catch (err) {
      console.error('LINE 推播失敗:', err)
    }
  }

  return NextResponse.json({ success: true, data })
}
