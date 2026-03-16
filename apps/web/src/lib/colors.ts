export const WHEEL_COLORS = [
  "#f97316", // orange
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f43f5e", // rose
  "#eab308", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
  "#14b8a6", // teal
  "#a855f7", // purple
  "#ef4444", // red
  "#22c55e", // green
];

export function getWheelColor(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length];
}
