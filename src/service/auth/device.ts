// ✅ Tạo và lưu trữ một "device id" giả lập để gắn với refresh token trên từng thiết bị người dùng
// (giúp backend phân biệt các thiết bị khác nhau của cùng một tài khoản)

const DEVICE_ID_KEY = 'device_id';
// Khóa (key) dùng để lưu "device_id" trong localStorage của trình duyệt

function generateUuid(): string {
    // ⚙️ Hàm sinh một chuỗi UUID v4 ngẫu nhiên (ví dụ: "8f14e45f-ea9c-4ab3-bcf8-7d4e4b2d3341")
    // UUID giúp định danh duy nhất mỗi thiết bị / trình duyệt

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;   // Tạo số ngẫu nhiên từ 0–15
        const v = c === 'x' ? r : (r & 0x3) | 0x8; // Quy tắc tạo UUID v4 (bit version và variant)
        return v.toString(16); // Chuyển thành ký tự hexa
    });
}

export function getOrCreateDeviceId(): string {
    // ⚙️ Hàm trả về device_id — nếu chưa có thì tự tạo mới và lưu lại
    try {
        const existing = localStorage.getItem(DEVICE_ID_KEY); // Lấy device_id đã lưu trong localStorage
        if (existing) return existing; // Nếu đã tồn tại thì dùng lại (đảm bảo mỗi thiết bị có ID cố định)

        const created = generateUuid(); // Nếu chưa có, tạo device_id mới
        localStorage.setItem(DEVICE_ID_KEY, created); // Lưu device_id vào localStorage
        return created; // Trả về ID vừa tạo
    } catch {
        // 🚨 Trong trường hợp localStorage không khả dụng (ví dụ chạy SSR hoặc chế độ private)
        // → sinh UUID tạm thời nhưng không lưu (chỉ dùng cho phiên này)
        return generateUuid();
    }
}

export function getUserAgent(): string | undefined {
    // ⚙️ Hàm lấy thông tin trình duyệt / thiết bị (User-Agent)
    // Dữ liệu này có thể gửi lên backend cùng device_id để backend biết loại thiết bị nào đang đăng nhập
    try {
        return typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
        // Trả về chuỗi user agent nếu đang chạy ở client (trình duyệt)
    } catch {
        // Trường hợp lỗi hoặc chạy trong môi trường không có `navigator` (SSR)
        return undefined;
    }
}
