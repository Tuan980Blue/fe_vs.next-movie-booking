export const COLORS = {
  PRIMARY: {
    PINK: "#ec4899",
    PURPLE: "#8b5cf6",
    BLACK: "#0a0a0a",
  },
  ACCENT: {
    YELLOW: "#fbbf24",
    ORANGE: "#f97316",
    RED: "#ef4444",
  },
  NEUTRAL: {
    WHITE: "#ffffff",
    DARK_GRAY: "#1f2937",
    LIGHT_GRAY: "#9ca3af",
  },
  CINEMA: {
    NEON_BLUE: "#00e5ff",
    NEON_PINK: "#ff6ec7",
    NAVY: "#0d253f",
  },
} as const;

export type Colors = typeof COLORS;


