import {NextResponse} from "next/server";
//Nó giúp bạn(tạo phản hồi) trả về kết quả cho request — ví dụ như cho phép next (đi tiếp),
// redirect(chuyển hướng), rewrite(ghi đè url), hoặc json(trả dữ liệu tùy chỉnh).
import type {NextRequest} from "next/server";
//Là kiểu dữ liệu (TypeScript type) của đối tượng request mà middleware nhận được.
//Nó đại diện cho request gửi đến server, giống như Request trong Web API.

//✅ Middleware sẽ chạy mỗi khi có một request đến Next.js app
export function middleware(request: NextRequest) {

    //Lấy url hiện tại và cookie của request
    const pathname = request.nextUrl.pathname;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    // Danh sách route PUBLIC nhưng path con của chúng cần private
    const publicRoutes = ['/auth', '/booking']

    const isPublic = publicRoutes.some((route) => pathname === route)

    if (!refreshToken && !isPublic) {
        // Gắn url cũ cho url mới để sau này callback
        const redirectUrl = `/auth?callbackUrl=${encodeURIComponent(pathname)}`

        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Cho phép đi tiếp
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/booking/:path*",
    ],
};


