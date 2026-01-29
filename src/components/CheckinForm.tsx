import { useEffect, useMemo, useState } from "react";
import { enqueueCheckin, flushQueueIfOnline, getQueueCount, pushCheckinOnline } from "../utils/offlineQueue";
import type { CheckinStatus } from "../types";

const NEEDS = ["Air", "Makanan", "Obat", "Evakuasi", "Listrik", "Lainnya"] as const;

type Props = { regionCode: string };

function StatusCard({
  active,
  title,
  desc,
  icon,
  tone,
  onClick
}: {
  active: boolean;
  title: string;
  desc: string;
  icon: string;
  tone: "green" | "red" | "yellow";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`statusCard ${active ? "active" : ""} ${tone}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div className="statusIcon" aria-hidden="true">{icon}</div>
      <div className="statusText">
        <div className="statusTitle">{title}</div>
        <div className="statusDesc">{desc}</div>
      </div>
    </button>
  );
}

export default function CheckinForm({ regionCode }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<CheckinStatus>("safe");
  const [needs, setNeeds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "warn" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [queueCount, setQueueCount] = useState(getQueueCount());

  useEffect(() => {
    const t = window.setInterval(() => setQueueCount(getQueueCount()), 800);
    return () => window.clearInterval(t);
  }, []);

  function resetForm() {
    setStep(1);
    setName("");
    setPhone("");
    setStatus("safe");
    setNeeds([]);
    setNotes("");
  }

  function toggleNeed(n: string) {
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  async function submit() {
    setMsg(null);
    const payload = {
      regionCode,
      name: name.trim(),
      phone: phone.trim() || undefined,
      status,
      needs: status === "help" ? needs : [],
      notes: status === "help" ? notes.trim() : "",
      reporter: "self" as const
    };

    if (!payload.name) {
      setMsg({ kind: "bad", text: "Nama wajib diisi." });
      return;
    }

    setBusy(true);

    // Offline-first: simpan dulu jika offline
    if (!navigator.onLine) {
      enqueueCheckin(payload);
      setQueueCount(getQueueCount());
      setMsg({
        kind: "warn",
        text: "Kamu sedang offline. Laporan disimpan dan akan dikirim saat online kembali. (Coba tombol “Kirim ulang antrian” jika perlu.)"
      });
      setBusy(false);
      resetForm();
      return;
    }

    try {
      await pushCheckinOnline(payload);
      setMsg({ kind: "ok", text: "✅ Laporan terkirim. Tetap waspada." });
      setBusy(false);
      resetForm();
      // Sekalian coba flush antrian yang mungkin masih ada
      flushQueueIfOnline();
      setQueueCount(getQueueCount());
    } catch {
      enqueueCheckin(payload);
      setQueueCount(getQueueCount());
      setMsg({
        kind: "warn",
        text: "Server sedang bermasalah. Laporan disimpan ke antrian dan akan dicoba lagi saat online."
      });
      setBusy(false);
      resetForm();
    }
  }

  async function retryQueue() {
    setBusy(true);
    try {
      await flushQueueIfOnline();
      setQueueCount(getQueueCount());
      setMsg({ kind: "ok", text: "✅ Proses kirim ulang antrian selesai." });
    } catch {
      setMsg({ kind: "bad", text: "Gagal kirim ulang antrian. Pastikan internet & Firestore OK." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0 }}>SiagaWarga</h2>
            <p className="muted" style={{ marginTop: 6 }}>
              Wilayah: <b>{regionCode}</b>
            </p>
          </div>

          <div className="pillWrap">
            <span className={`pill ${navigator.onLine ? "online" : "offline"}`}>
              {navigator.onLine ? "Online" : "Offline"}
            </span>
            <span className="pill neutral">Antrian: <b>{queueCount}</b></span>
          </div>
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <button type="button" className="btn ghost" onClick={retryQueue} disabled={busy || queueCount === 0}>
            Kirim ulang antrian
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => { resetForm(); setMsg(null); }}
            disabled={busy}
          >
            Reset
          </button>
        </div>

        {msg && (
          <div className={`notice ${msg.kind}`}>
            {msg.text}
          </div>
        )}
      </div>

      <div className="card">
        {step === 1 ? (
          <>
            <h3 style={{ marginTop: 0 }}>Kondisi kamu sekarang?</h3>
            <p className="muted">Pilih satu. Setelah itu baru isi data singkat.</p>

            <div className="statusGrid">
              <StatusCard
                active={status === "safe"}
                title="Saya Aman"
                desc="Saya baik-baik saja."
                icon="🟢"
                tone="green"
                onClick={() => { setStatus("safe"); setStep(2); }}
              />
              <StatusCard
                active={status === "help"}
                title="Butuh Bantuan"
                desc="Saya perlu bantuan segera."
                icon="🔴"
                tone="red"
                onClick={() => { setStatus("help"); setStep(2); }}
              />
              <StatusCard
                active={status === "unreachable"}
                title="Melaporkan Orang Lain"
                desc="Saya melapor kondisi orang lain."
                icon="🟡"
                tone="yellow"
                onClick={() => { setStatus("unreachable"); setStep(2); }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Data singkat</h3>
                <p className="muted" style={{ marginTop: 6 }}>
                  Status dipilih: <b>{status === "safe" ? "Aman" : status === "help" ? "Butuh Bantuan" : "Melapor Orang Lain"}</b>
                </p>
              </div>
              <button type="button" className="btn ghost" onClick={() => setStep(1)} disabled={busy}>
                Ganti status
              </button>
            </div>

            <div className="grid2">
              <div>
                <label>Nama</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
              </div>
              <div>
                <label>No HP (opsional)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx / 62xxxx" />
              </div>
            </div>

            {status === "help" && (
              <>
                <label>Kebutuhan</label>
                <div className="chips">
                  {NEEDS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={needs.includes(n) ? "chip active" : "chip"}
                      onClick={() => toggleNeed(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <label>Catatan (opsional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: butuh evakuasi, 1 lansia, lokasi dekat musholla..."
                  rows={3}
                />
              </>
            )}

            <button type="button" className="btn primary" onClick={submit} disabled={busy}>
              {busy ? "Mengirim..." : "Kirim laporan"}
            </button>

            <div className="tiny" style={{ marginTop: 10 }}>
              Tips: untuk test offline, aktifkan <b>DevTools → Network → Offline</b>, kirim laporan, lalu kembali online dan tekan{" "}
              <b>“Kirim ulang antrian”</b>.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
