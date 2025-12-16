'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Page() {
  const [lineName, setLineName] = useState('')

  useEffect(() => {
    liff
      .init({ liffId: '2008710921-W2J0NDPB' })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const profile = await liff.getProfile()
        setLineName(profile.displayName)
      })
      .catch(console.error)
  }, [])

  return (
    <input
      value={lineName}
      placeholder="LINE 顯示名稱"
      readOnly
    />
  )
}
