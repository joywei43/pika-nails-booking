// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      return NextResponse.json(
        { error: "尚未設定管理者帳號密碼（環境變數缺失）" },
        { status: 500 }
      );
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json(
        { error: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });

    // 設定管理者登入 cookie
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 小時
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "登入失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
