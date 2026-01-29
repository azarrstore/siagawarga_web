import type { CheckinRow } from "../types";

export function toCSV(rows: CheckinRow[]): string {
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const headers = ["Nama", "Wilayah", "Status", "Kebutuhan", "Catatan", "No HP", "Waktu"];

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) =>
      [
        r.name,
        r.regionCode,
        r.status,
        (r.needs || []).join(" | "),
        r.notes || "",
        r.phone || "",
        r._timeText || ""
      ].map(escape).join(",")
    )
  ];

  return lines.join("\n");
}

export function downloadCSV(filename: string, csvText: string) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
