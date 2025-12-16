'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [lineName, setLineName] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: '2008710921-W2J0NDPB' })

        // 🔥 關鍵 1：一定要在 LIFF 裡
        if (!liff.isInClient()) {
          document.body.innerHTML = `
            <div style="padding:40px;font-size:18px">
              ⚠️ 請從 LINE 圖文選單進入預約
            </div>
          `
          return
        }

        // 🔥 關鍵 2：沒登入就登入
        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        // 🔥 關鍵 3：拿 profile
        const profile = await liff.getProfile()
        setLineName(profile.displayName)
        setReady(true)
      } catch (err) {
        console.error(err)
      }
    }

    initLiff()
  }, [])

  if (!ready) return null

  return (
    <input
      value={lineName}
      readOnly
      placeholder="LINE 顯示名稱"
    />
  )
}
