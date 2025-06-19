export const formattedPrice = (price:number) => new Intl.NumberFormat('vi-VN').format(price);

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Vietnamese name normalization: uppercase, remove special symbols, allow Vietnamese letters and spaces only
export function normalizeVietnameseName(str: string) {
  // Remove special symbols, allow Vietnamese letters and spaces (basic, ES5 compatible)
  let s = str.replace(/[^A-Z a-zÀ-ỹà-ỹ\s]/g, ""); // This covers most Vietnamese letters
  // Uppercase
  s = s.toUpperCase();
  // Remove extra spaces
  s = s.replace(/\s+/g, " ").trim();
  return s;
}