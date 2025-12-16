// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 只保護 /admin 和 /api/admin 開頭的路徑
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // 允許的公開路徑：登入頁 & 登入 API
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if ((isAdminPath || isAdminApi) && !isLoginPage && !isLoginApi) {
    const auth = req.cookies.get("admin_auth");

    if (!auth || auth.value !== "1") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 告訴 Next.js 這些路徑要套用 middleware
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
