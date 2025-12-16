'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'
import LiffProvider from './liff-provider'

export default function Page() {
  const [lineName, setLineName] = useState('')

  useEffect(() => {
    liff.getProfile().then((profile) => {
      setLineName(profile.displayName)
    })
  }, [])

  return (
    <LiffProvider>
      <input
        value={lineName}
        placeholder="LINE 顯示名稱"
        readOnly
      />
    </LiffProvider>
  )
}
