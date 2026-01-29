import { useMemo } from "react";
import { waLink } from "../utils/wa";
import type { CheckinRow, CheckinStatus } from "../types";

function statusLabel(s: CheckinStatus): string {
  if (s === "safe") return "Aman";
  if (s === "help") return "Butuh Bantuan";
  if (s === "unreachable") return "Lapor Orang Lain";
  return s;
}

type Props = { rows: CheckinRow[] };

export default function CheckinTable({ rows }: Props) {
  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => (b._time || 0) - (a._time || 0));
    return copy;
  }, [rows]);

  return (
    <div className="card">
      <h3>Daftar Check-in</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status</th>
              <th>Kebutuhan</th>
              <th>Waktu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const needs = (r.needs || []).join(", ");
              const msg = `SiagaWarga | ${r.regionCode}\nNama: ${r.name}\nStatus: ${statusLabel(
                r.status
              )}\nKebutuhan: ${needs || "-"}\nCatatan: ${r.notes || "-"}\nWaktu: ${r._timeText || "-"}`;
              return (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{statusLabel(r.status)}</td>
                  <td className="muted">{needs || "-"}</td>
                  <td className="muted">{r._timeText || "-"}</td>
                  <td>
                    <a className="linkBtn" href={waLink(r.phone, msg)} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}
            {!sorted.length && (
              <tr>
                <td colSpan={5} className="muted">
                  Belum ada laporan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
