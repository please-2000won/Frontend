// ISO date-time 문자열을 "방금 전 / N분 전 / N시간 전 / N일 전 / YYYY.MM.DD" 형태로.
export const formatTimeAgo = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60_000);

  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// 툴팁 등에 넣을 정확한 시각. "2026.09.04 12:30"
export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};
