"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectTo, setRedirectTo] = useState("/admin");

  // ✅ 改用 window.location 讀取 ?from= 參數，就不用 useSearchParams()
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from) setRedirectTo(from);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "登入失敗");
      setLoading(false);
      return;
    }

    // 登入成功 → 導回原本想去的頁面（預設 /admin）
    router.push(redirectTo);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <header className="mb-8 text-center space-y-2">
          <p className="text-xs tracking-[0.25em] text-zinc-500">
            PIKA NAILS · ADMIN
          </p>
          <h1 className="text-2xl font-semibold">管理者登入</h1>
          <p className="text-sm text-zinc-400">
            請輸入管理帳號與密碼，進入後台預約管理。
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-sm">
              <label className="text-zinc-300">帳號</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="text-zinc-300">密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "登入中..." : "登入後台"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
