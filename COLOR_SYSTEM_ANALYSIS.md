# Phân Tích Hệ Thống Màu Sắc Frontend

## 📋 Tổng Quan

Hệ thống màu sắc của ứng dụng Cinema Booking được tổ chức theo 4 nhóm chính:
- **PRIMARY** (Màu chính)
- **ACCENT** (Màu nhấn)
- **NEUTRAL** (Màu trung tính)
- **CINEMA** (Màu đặc trưng rạp chiếu)

---

## 🎨 Chi Tiết Bảng Màu

### 1. PRIMARY COLORS (Màu Chính)

| Tên | Hex Code | RGB | Sử dụng |
|-----|----------|-----|---------|
| **PINK** | `#ec4899` | rgb(236, 72, 153) | Màu chủ đạo, buttons, highlights |
| **PURPLE** | `#1f133a` (colors.ts)<br>`#271659` (tailwind/css) | rgb(31, 19, 58)<br>rgb(39, 22, 89) | Background, text, branding |
| **BLACK** | `#0a0a0a` | rgb(10, 10, 10) | Dark backgrounds |

**⚠️ Lưu ý:** Có sự không nhất quán giữa `colors.ts` và `tailwind.config.js`:
- `colors.ts`: `#1f133a`
- `tailwind.config.js` & `globals.css`: `#271659`

**Khuyến nghị:** Nên thống nhất giá trị này.

---

### 2. ACCENT COLORS (Màu Nhấn)

| Tên | Hex Code | RGB | Sử dụng |
|-----|----------|-----|---------|
| **YELLOW** | `#fbbf24` | rgb(251, 191, 36) | CTA buttons, warnings, highlights |
| **ORANGE** | `#f97316` | rgb(249, 115, 22) | Hover states, gradients |
| **RED** | `#ef4444` | rgb(239, 68, 68) | Errors, alerts, danger states |

---

### 3. NEUTRAL COLORS (Màu Trung Tính)

| Tên | Hex Code | RGB | Sử dụng |
|-----|----------|-----|---------|
| **WHITE** | `#ffffff` | rgb(255, 255, 255) | Text trên dark bg, backgrounds |
| **DARK_GRAY** | `#1f2937` | rgb(31, 41, 55) | Text, borders, secondary elements |
| **LIGHT_GRAY** | `#9ca3af` | rgb(156, 163, 175) | Placeholders, disabled states |

---

### 4. CINEMA COLORS (Màu Đặc Trưng)

| Tên | Hex Code | RGB | Sử dụng |
|-----|----------|-----|---------|
| **NEON_BLUE** | `#00e5ff` | rgb(0, 229, 255) | Accents, decorative elements |
| **NEON_PINK** | `#ff6ec7` | rgb(255, 110, 199) | Hover states, gradients |
| **NAVY** | `#0d253f` | rgb(13, 37, 63) | Dark sections, headers |

---

## 📁 Cấu Trúc File

### 1. `src/lib/theme/colors.ts`
File định nghĩa màu dưới dạng TypeScript constant:
```typescript
export const COLORS = {
  PRIMARY: { PINK, PURPLE, BLACK },
  ACCENT: { YELLOW, ORANGE, RED },
  NEUTRAL: { WHITE, DARK_GRAY, LIGHT_GRAY },
  CINEMA: { NEON_BLUE, NEON_PINK, NAVY }
}
```

**Sử dụng:** Import trực tiếp trong TypeScript/TSX files
```typescript
import { COLORS } from '@/lib/theme/colors';
```

### 2. `tailwind.config.js`
Mở rộng Tailwind với custom color classes:
- `primary-pink`, `primary-purple`, `primary-black`
- `accent-yellow`, `accent-orange`, `accent-red`
- `neutral-white`, `neutral-darkGray`, `neutral-lightGray`
- `cinema-neonBlue`, `cinema-neonPink`, `cinema-navy`

**Sử dụng:** Tailwind utility classes
```tsx
<div className="bg-primary-pink text-neutral-white">
```

### 3. `src/lib/styles/globals.css`
Định nghĩa CSS variables:
- `--color-primary-pink`
- `--color-primary-purple`
- `--color-accent-*`
- `--color-neutral-*`
- `--color-cinema-*`

**Sử dụng:** CSS variables
```css
.custom-element {
  background: var(--color-primary-pink);
}
```

---

## 🎯 Mẫu Sử Dụng Trong Components

### Gradient Patterns
```tsx
// Payment Status
"from-primary-pink to-cinema-neonPink"
"from-accent-yellow to-accent-orange"
"from-accent-red to-red-600"

// Backgrounds
"bg-gradient-to-br from-primary-purple/30 via-primary-purple/20 to-primary-pink/10"
```

### Button Variants
```tsx
// Primary Button
"bg-primary-pink text-neutral-white hover:bg-cinema-neonPink"

// Secondary Button
"bg-neutral-white/90 text-primary-purple border-2 border-accent-yellow/50"

// Outline Button
"border-2 border-primary-pink/50 text-primary-pink bg-white/5"
```

### Status Colors
- **Success:** `primary-pink` → `cinema-neonPink`
- **Pending:** `accent-yellow` → `accent-orange`
- **Failed:** `accent-red` → `red-600`

---

## 📊 Thống Kê Sử Dụng

Theo thống kê từ codebase:
- **429 lần** sử dụng các màu custom trong **29 files**
- Các component sử dụng nhiều nhất:
  - `PaymentStatusContent.tsx`
  - `Navbar.tsx`
  - `MovieCard.tsx`
  - `BookingForm.tsx`
  - `SeatSelectionContent.tsx`

---

## ⚠️ Vấn Đề & Khuyến Nghị

### 1. Inconsistency trong Purple Color
**Vấn đề:** 
- `colors.ts`: `#1f133a`
- `tailwind.config.js`: `#271659`
- `globals.css`: `#271659`

**Khuyến nghị:** 
- Thống nhất sử dụng `#271659` (đang được dùng nhiều hơn)
- Hoặc cập nhật tất cả về `#1f133a` nếu muốn giữ màu tối hơn

### 2. Hardcoded Colors
Một số component vẫn sử dụng hardcoded colors:
```tsx
// Ví dụ trong MovieCard.tsx
"bg-pink-600 hover:bg-pink-700"
"text-pink-600"
"bg-pink-500 hover:bg-cinema-neonPink"
```

**Khuyến nghị:**
- Thay thế bằng Tailwind custom colors hoặc COLORS constant
- Đảm bảo tính nhất quán trong toàn bộ ứng dụng

### 3. Missing Color Variants
**Khuyến nghị thêm:**
- Light/Dark variants cho mỗi màu
- Opacity variants (10%, 20%, 50%, etc.)
- Hover states được định nghĩa rõ ràng

---

## 🔄 Best Practices

### 1. Sử dụng Tailwind Classes (Ưu tiên)
```tsx
✅ <div className="bg-primary-pink text-neutral-white">
❌ <div style={{ backgroundColor: '#ec4899' }}>
```

### 2. Sử dụng COLORS constant cho logic
```tscript
✅ const buttonColor = COLORS.PRIMARY.PINK;
❌ const buttonColor = '#ec4899';
```

### 3. Sử dụng CSS Variables cho custom styling
```css
✅ .custom { background: var(--color-primary-pink); }
❌ .custom { background: #ec4899; }
```

---

## 🎨 Color Palette Visualization

```
PRIMARY COLORS
┌─────────────┬─────────────┬─────────────┐
│   PINK      │   PURPLE    │   BLACK     │
│  #ec4899    │  #271659    │  #0a0a0a    │
│  [████]     │  [████]     │  [████]     │
└─────────────┴─────────────┴─────────────┘

ACCENT COLORS
┌─────────────┬─────────────┬─────────────┐
│  YELLOW     │  ORANGE     │    RED      │
│  #fbbf24    │  #f97316    │  #ef4444    │
│  [████]     │  [████]     │  [████]     │
└─────────────┴─────────────┴─────────────┘

NEUTRAL COLORS
┌─────────────┬─────────────┬─────────────┐
│   WHITE     │ DARK_GRAY   │ LIGHT_GRAY  │
│  #ffffff    │  #1f2937    │  #9ca3af    │
│  [████]     │  [████]     │  [████]     │
└─────────────┴─────────────┴─────────────┘

CINEMA COLORS
┌─────────────┬─────────────┬─────────────┐
│ NEON_BLUE   │ NEON_PINK   │    NAVY     │
│  #00e5ff    │  #ff6ec7    │  #0d253f    │
│  [████]     │  [████]     │  [████]     │
└─────────────┴─────────────┴─────────────┘
```

---

## 📝 Kết Luận

Hệ thống màu sắc được tổ chức tốt với 3 lớp định nghĩa (TypeScript constants, Tailwind config, CSS variables). Tuy nhiên cần:
1. ✅ Thống nhất giá trị màu purple
2. ✅ Thay thế hardcoded colors bằng system colors
3. ✅ Bổ sung variants và documentation

**Tổng số màu:** 13 màu chính
**Tổng số file sử dụng:** 29 files
**Tổng số lần sử dụng:** 429+ instances

