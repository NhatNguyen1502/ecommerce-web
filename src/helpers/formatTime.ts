import moment from "moment-timezone";
export function formatTimeAgo(time: string): string {
  // Convert UTC time to Vietnam timezone
  const date = moment.tz(time,"Asia/Ho_Chi_Minh");
  const now = moment().tz("Asia/Ho_Chi_Minh");
  const diffInSeconds = now.diff(date, "seconds");

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = now.diff(date, "minutes");
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = now.diff(date, "hours");
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = now.diff(date, "days");
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.format("DD MMMM YYYY, HH:mm");
}
