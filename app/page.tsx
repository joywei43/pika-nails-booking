'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [status, setStatus] = useState('初始化中...')
  const [lineName, setLineName] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setStatus('liff.init()')

        await liff.init({
          liffId: '2008710921-W2J0NDPB',
        })

        setStatus('init 完成')

        // ❗ 關鍵：確認是不是 LIFF 環境
        if (!liff.isInClient()) {
          setStatus('❌ 不是從 LINE 內開啟')
          return
        }

        setStatus('在 LINE 內')

        if (!liff.isLoggedIn()) {
          setStatus('尚未登入，導向 login')
          liff.login()
          return
        }

        setStatus('已登入，讀取 profile')

        const profile = await liff.getProfile()
        setLineName(profile.displayName)

        setStatus('✅ 成功取得名稱')
      } catch (err) {
        console.error(err)
        setStatus('❌ 發生錯誤，請看 console')
      }
    }

    run()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <p>{status}</p>

      <input
        value={lineName}
        placeholder="LINE 顯示名稱"
        readOnly
        style={{ width: '100%', padding: 8 }}
      />
    </div>
  )
}
