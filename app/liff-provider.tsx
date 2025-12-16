'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function LiffProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    liff
      .init({ liffId: '2008710921-W2J0NDPB' })
      .then(() => {
        if (!liff.isInClient()) {
          alert('請從 LINE 內開啟')
          return
        }

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        setReady(true)
      })
      .catch((err) => {
        console.error('LIFF init failed', err)
      })
  }, [])

  if (!ready) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '40vh' }}>
        載入中…
      </div>
    )
  }

  return <>{children}</>
}
