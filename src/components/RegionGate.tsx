import { useMemo, useState } from "react";

type Props = {
  mode?: "citizen" | "admin";
  onReady: (args: { regionCode: string; pin?: string }) => void;
};

export default function RegionGate({ mode = "citizen", onReady }: Props) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [regionCode, setRegionCode] = useState<string>(params.get("kode") || "");
  const [pin, setPin] = useState<string>(params.get("pin") || "");

  const isAdmin = mode === "admin";

  return (
    <div className="card">
      <h2>{isAdmin ? "Akses Admin" : "Masuk Wilayah"}</h2>
      <p className="muted">Masukkan kode wilayah. Bisa disebar lewat QR atau link.</p>

      <div className="grid2">
        <div>
          <label>Kode Wilayah</label>
          <input
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
            placeholder="Contoh: RT05RW02-2025"
          />
        </div>

        {isAdmin && (
          <div>
            <label>PIN Admin</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Contoh: 1234"
              type="password"
            />
          </div>
        )}
      </div>

      <button
        className="btn"
        onClick={() => onReady({ regionCode: regionCode.trim(), pin: isAdmin ? pin.trim() : undefined })}
        disabled={!regionCode.trim() || (isAdmin && !pin.trim())}
      >
        Lanjut
      </button>

      <div className="hint">
        Tip: buat link seperti <code>/?kode=RT05RW02-2025</code> atau{" "}
        <code>/admin?kode=RT05RW02-2025&amp;pin=1234</code>
      </div>
    </div>
  );
}
