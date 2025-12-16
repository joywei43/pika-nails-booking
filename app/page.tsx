'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [lineName, setLineName] = useState('')
  const [error, setError] = useState('')

useEffect(() => {
  const runLiff = async () => {
    await liff.init({ liffId: '2008710921-W2J0NDPB' })

    if (!liff.isInClient()) {
      console.error('❌ 不是在 LINE LIFF WebView 裡')
      return
    }

    if (!liff.isLoggedIn()) {
      liff.login()
      return
    }

    const profile = await liff.getProfile()
    setLineName(profile.displayName)
  }

  runLiff()
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
