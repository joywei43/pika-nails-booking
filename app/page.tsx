'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [lineName, setLineName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    liff.init({ liffId: '2008710921-W2J0NDPB' })
      .then(async () => {
        // 🔴 關鍵判斷
        if (!liff.isInClient()) {
          setError('請從 LINE 圖文選單開啟本頁')
          return
        }

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const profile = await liff.getProfile()
        setLineName(profile.displayName)
      })
      .catch(err => {
        console.error(err)
        setError('LIFF 初始化失敗')
      })
  }, [])

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <input
      value={lineName}
      placeholder="LINE 顯示名稱"
      readOnly
    />
  )
}
