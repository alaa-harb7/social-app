export default function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "just now";
  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
}
