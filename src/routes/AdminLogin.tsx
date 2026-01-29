import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function login() {
    setMsg(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e: any) {
      setMsg(e?.message || "Login gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>Login Admin</h2>
      <p className="muted">Dashboard admin dikunci. Warga tidak perlu login.</p>

      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@email.com"
        autoComplete="email"
      />

      <label>Password</label>
      <input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <button className="btn primary" onClick={login} disabled={busy || !email || !pass}>
        {busy ? "Masuk..." : "Masuk"}
      </button>

      {msg && <div className="notice bad">{msg}</div>}
    </div>
  );
}
