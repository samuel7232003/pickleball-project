export const formattedPrice = (price:number) => new Intl.NumberFormat('vi-VN').format(price);

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));