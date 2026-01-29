export function waLink(phone: string | undefined, message: string): string {
  const p = (phone || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || "");
  if (!p) return `https://wa.me/?text=${text}`;
  return `https://wa.me/${p}?text=${text}`;
}
