"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setSuccess("");
  setError("");

  // ✅ 把 form 先存起來，之後都用這個變數
  const form = e.currentTarget;
  const formData = new FormData(form);

  const body = {
    lineName: formData.get("lineName"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    time: formData.get("time"),
    style: formData.get("style"),
    needRemoval: formData.get("needRemoval") === "true",
  };

  const res = await fetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "預約送出失敗，請再試一次");
    setLoading(false);
    return;
  }

  setSuccess("預約已送出，我們會在 24 小時內透過 LINE 回覆您 ✨");
  setLoading(false);

  // ✅ 改用 form.reset()，這時候 form 不會是 null
  form.reset();
}


  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
        
        {/* 品牌區 */}
        <header className="space-y-2 text-center">
          <p className="text-xs tracking-[0.25em] text-zinc-400">PIKA NAILS</p>
          <h1 className="text-3xl font-semibold tracking-wide">線上預約</h1>
          <p className="text-sm text-zinc-400">
            請填寫預約資料，我們將在 24 小時內透過 LINE 與您確認 ✨
          </p>
        </header>

        {/* 表單卡片 */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 姓名 / 電話 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-zinc-300">LINE 顯示名稱 *</span>
                <input
                  name="lineName"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="text-zinc-300">聯絡電話</span>
                <input
                  name="phone"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                />
              </label>
            </div>

            {/* 日期 / 時間 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-zinc-300">日期 *</span>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="text-zinc-300">時間 *</span>
                <select
                  name="time"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                >
                  <option value="">請選擇</option>
                  <option value="10:00">10:00</option>
                  <option value="12:00">12:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </label>
            </div>

            {/* 款式 */}
            <label className="space-y-1 text-sm block">
              <span className="text-zinc-300">款式 *</span>
              <select
                name="style"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
              >
                <option value="貓眼">貓眼</option>
                <option value="純色">純色</option>
                <option value="跳色">跳色</option>
                <option value="暈染">暈染</option>
              </select>
            </label>

            {/* 卸甲 */}
            <label className="space-y-1 text-sm block">
              <span className="text-zinc-300">是否需要卸甲？</span>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="needRemoval" value="true" />
                  需要
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="needRemoval" value="false" defaultChecked />
                  不需要
                </label>
              </div>
            </label>

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "送出中..." : "送出預約"}
            </button>

            {/* 提示訊息 */}
            {success && <p className="text-emerald-400 text-center text-sm">{success}</p>}
            {error && <p className="text-rose-400 text-center text-sm">{error}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}
