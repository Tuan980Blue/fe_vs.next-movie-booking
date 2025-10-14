import { NextResponse } from "next/server";
//Nó giúp bạn(tạo phản hồi) trả về kết quả cho request — ví dụ như cho phép next (đi tiếp),
// redirect(chuyển hướng), rewrite(ghi đè url), hoặc json(trả dữ liệu tùy chỉnh).
import type { NextRequest } from "next/server";
//Là kiểu dữ liệu (TypeScript type) của đối tượng request mà middleware nhận được.
//Nó đại diện cho request gửi đến server, giống như Request trong Web API.
// request.url	URL đầy đủ của request
// request.nextUrl	Một đối tượng URL tiện lợi để đọc pathname, query...
// request.cookies	Dễ dàng đọc cookies
// request.headers	Đọc header HTTP (như Authorization, User-Agent...)
// request.geo	Thông tin vị trí địa lý (nếu bật)
// request.ip	IP của người dùng (nếu có Edge runtime hỗ trợ)

export function middleware(request: NextRequest) {
    console.log("🟢 Middleware đang chạy cho:", request.nextUrl.pathname);

    // Lấy cookie
    const refreshToken = request.cookies.get("refresh_token")?.value;

    // Nếu chưa có thì redirect
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Nếu có thì cho phép đi tiếp
    return NextResponse.next();
}

export const config = {
  // Match both the exact base path and any nested paths (must be static for Next.js)
  matcher: [
    "/admin",
    "/admin/:path*",
    "/user",
    "/user/:path*",
    "/booking",
    "/booking/:path*",
  ],
};


