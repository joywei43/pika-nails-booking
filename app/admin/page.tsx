"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  date: string;
  time: string;
  style?: string;
  need_removal?: boolean;
  status: string;
  // 下面這幾個名字為了相容不同 API 寫法，全部列出
  customer_name?: string;
  customerName?: string;
  name?: string;
  line_name?: string;
  phone?: string | null;
  customer_phone?: string | null;
  customers?: {
    line_name?: string;
    phone?: string | null;
  } | null;
  customer?: {
    line_name?: string;
    phone?: string | null;
  } | null;
};

const statusLabelMap: Record<string, string> = {
  pending: "待審核",
  confirmed: "已確認",
  cancelled: "已取消",
};

const statusColorMap: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-rose-500/10 text-rose-400",
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "取得預約列表失敗");
      }

      setBookings(data.bookings || data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "取得預約列表失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    try {
      setUpdatingId(id);
      setMessage(null);
      setError(null);

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "更新預約狀態失敗");
      }

      setMessage(
        status === "confirmed" ? "已將預約標記為已確認 ✅" : "已將預約標記為取消 ❌"
      );

      // 更新畫面上的資料
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status,
              }
            : b
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "更新預約狀態失敗");
    } finally {
      setUpdatingId(null);
    }
  }

  function getCustomerName(b: Booking) {
    return (
      b.customer_name ||
      b.customerName ||
      b.name ||
      b.line_name ||
      b.customer?.line_name ||
      b.customers?.line_name ||
      "-"
    );
  }

  function getCustomerPhone(b: Booking) {
    return (
      b.phone ||
      b.customer_phone ||
      b.customer?.phone ||
      b.customers?.phone ||
      "-"
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs tracking-[0.25em] text-zinc-500">
            PIKA NAILS · ADMIN
          </p>
          <h1 className="text-2xl font-semibold">後台預約管理</h1>
          <p className="text-sm text-zinc-400">
            這裡會看到所有客人的預約申請，可以在這裡標記「已確認」或「取消」。
          </p>
        </header>

        {/* 訊息區塊 */}
        {message && (
          <p className="rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg border border-rose-600/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        {/* 表格卡片 */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-zinc-300">預約列表</h2>
            <button
              onClick={fetchBookings}
              className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
            >
              重新整理
            </button>
          </div>

          {loading ? (
            <p className="py-6 text-center text-sm text-zinc-400">
              載入中...
            </p>
          ) : bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">
              目前沒有預約。
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">日期</th>
                    <th className="px-4 py-3">時間</th>
                    <th className="px-4 py-3">客人</th>
                    <th className="px-4 py-3">電話</th>
                    <th className="px-4 py-3">款式</th>
                    <th className="px-4 py-3">卸甲</th>
                    <th className="px-4 py-3">狀態</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {bookings.map((b) => {
                    const label = statusLabelMap[b.status] ?? b.status;
                    const color =
                      statusColorMap[b.status] ??
                      "bg-zinc-700 text-zinc-100";

                    return (
                      <tr key={b.id} className="hover:bg-zinc-900/60">
                        <td className="px-4 py-3 align-middle">
                          {b.date}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {b.time}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {getCustomerName(b)}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {getCustomerPhone(b)}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {b.style || "-"}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {b.need_removal ? "需要" : "不需要"}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                updateStatus(b.id, "confirmed")
                              }
                              disabled={updatingId === b.id}
                              className="rounded-full border border-emerald-500/60 px-3 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              接受
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(b.id, "cancelled")
                              }
                              disabled={updatingId === b.id}
                              className="rounded-full border border-rose-500/60 px-3 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              取消
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
