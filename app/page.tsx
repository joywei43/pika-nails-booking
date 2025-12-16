'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Home() {
  const [lineName, setLineName] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: '2008710921-W2J0NDPB', // ✅ 你的新 LIFF ID
        })

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const profile = await liff.getProfile()
        setLineName(profile.displayName)
        setReady(true)
      } catch (err) {
        console.error('LIFF init failed', err)
      }
    }

    initLiff()
  }, [])

  if (!ready) {
    return (
      <main style={{ color: 'white', padding: 40 }}>
        LIFF loading...
      </main>
    )
  }

  return (
    <main style={{ color: 'white', padding: 40 }}>
      <h1>線上預約</h1>

      <label>LINE 顯示名稱 *</label>
      <input
        value={lineName}
        readOnly
        style={{
          display: 'block',
          marginTop: 8,
          padding: 8,
          width: '100%',
        }}
      />
    </main>
  )
}
