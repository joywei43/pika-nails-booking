'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [lineName, setLineName] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const run = async () => {
      await liff.init({ liffId: '2008710921-W2J0NDPB' })

      // ✅ 不是在 LINE 裡 → 直接顯示錯誤
      if (!liff.isInClient()) {
        alert('請從 LINE 圖文選單開啟')
        return
      }

      if (!liff.isLoggedIn()) {
        liff.login()
        return
      }

      const profile = await liff.getProfile()
      setLineName(profile.displayName)
      setReady(true)
    }

    run().catch(console.error)
  }, [])

  if (!ready) return <p style={{ color: 'white' }}>LIFF 初始化中…</p>

  return (
    <input
      value={lineName}
      readOnly
      placeholder="LINE 顯示名稱"
      style={{ padding: 12, fontSize: 16 }}
    />
  )
}
