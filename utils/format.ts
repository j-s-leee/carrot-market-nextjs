export function formatToTimeAgo(date: string): string {
  const formatter = new Intl.RelativeTimeFormat("ko");
  const dayInMs = 1000 * 60 * 60 * 24;
  const hoursInMs = 1000 * 60 * 60;
  const minInMs = 1000 * 60;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = time - now;
  const dayDiff = Math.round(diff / dayInMs);
  const hourDiff = Math.round(diff / hoursInMs);
  const minDiff = Math.round(diff / minInMs);
  if (hourDiff === 0) {
    return formatter.format(minDiff, "minutes");
  }
  if (dayDiff === 0) {
    return formatter.format(hourDiff, "hours");
  }
  return formatter.format(dayDiff, "days");
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
