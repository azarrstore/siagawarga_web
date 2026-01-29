import { useEffect, useMemo, useState } from "react";
import RegionGate from "../components/RegionGate";
import StatCards from "../components/StatCards";
import CheckinTable from "../components/CheckinTable";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { downloadCSV, toCSV } from "../utils/csv";
import type { CheckinRow, CheckinStatus } from "../types";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AdminLogin from "./AdminLogin";

export default function Admin() {
  const [regionCode, setRegionCode] = useState("");
  const [pin, setPin] = useState("");
  const [rows, setRows] = useState<CheckinRow[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [subErr, setSubErr] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setLoggedIn(!!u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  function ready(args: { regionCode: string; pin?: string }) {
    setRegionCode(args.regionCode);
    setPin(args.pin || "");
  }

  useEffect(() => {
    if (!loggedIn || !regionCode) return;

    setSubErr(null);
    const qy = query(collection(db, "checkins"), where("regionCode", "==", regionCode));
    const unsub = onSnapshot(
      qy,
      (snap) => {
        const data: CheckinRow[] = snap.docs.map((d) => {
          const v = d.data() as { createdAt?: { toDate?: () => Date } } & Record<string, unknown>;
          const ts = (v.createdAt as any)?.toDate?.() ?? null;
          const time = ts ? ts.getTime() : 0;
          const timeText = ts ? ts.toLocaleString("id-ID") : "";
          return {
            id: d.id,
            regionCode: String(v.regionCode || ""),
            name: String(v.name || ""),
            phone: v.phone ? String(v.phone) : undefined,
            status: (v.status as CheckinStatus) || "safe",
            needs: Array.isArray(v.needs) ? (v.needs as string[]) : [],
            notes: v.notes ? String(v.notes) : "",
            reporter: (v.reporter as "self" | "other") || "self",
            _time: time,
            _timeText: timeText
          };
        });
        setRows(data);
      },
      (err) => setSubErr(err?.message || "Gagal memuat data (cek Firestore rules & Auth).")
    );

    return () => unsub();
  }, [loggedIn, regionCode]);

  const stats = useMemo(() => {
    const safe = rows.filter((r) => r.status === "safe").length;
    const help = rows.filter((r) => r.status === "help").length;
    const unreachable = rows.filter((r) => r.status === "unreachable").length;
    return { safe, help, unreachable, total: rows.length };
  }, [rows]);

  if (!authReady) return <div className="card">Memuat autentikasi...</div>;
  if (!loggedIn) return <AdminLogin />;

  if (!regionCode) return <RegionGate mode="admin" onReady={ready} />;

  function exportCSV() {
    const csv = toCSV(rows);
    const fn = `siagawarga_${regionCode}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(fn, csv);
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard Admin</h2>
            <p className="muted" style={{ marginTop: 6 }}>
              Wilayah: <b>{regionCode}</b> | PIN: <b>{pin}</b> (PIN hanya label MVP, akses utama via login)
            </p>
          </div>
          <div className="row">
            <button className="btn ghost" onClick={() => signOut(auth)}>Logout</button>
          </div>
        </div>

        <div className="row">
          <button className="btn" onClick={exportCSV}>Export CSV</button>
          <button className="btn ghost" onClick={() => { setRegionCode(""); setPin(""); setRows([]); }}>
            Ganti Wilayah
          </button>
        </div>

        {subErr && <div className="notice bad" style={{ marginTop: 12 }}>{subErr}</div>}
      </div>

      <StatCards stats={stats} />
      <CheckinTable rows={rows} />
    </div>
  );
}
