'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function Page() {
  const [lineName, setLineName] = useState('');

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: '2008710921-W2J0NDPB',
        });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        setLineName(profile.displayName);
      } catch (err) {
        console.error('LIFF init failed', err);
      }
    };

    initLiff();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>線上預約</h1>

      <label>LINE 顯示名稱</label>
      <input
        value={lineName}
        readOnly
        placeholder="從 LINE 自動帶入"
        style={{ width: '100%', padding: 8, marginTop: 8 }}
      />
    </main>
  );
}
