type Props = {
  stats: { safe: number; help: number; unreachable: number; total: number };
};

export default function StatCards({ stats }: Props) {
  return (
    <div className="stats">
      <div className="stat">
        <div className="statLabel">Aman</div>
        <div className="statValue">{stats.safe}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Butuh Bantuan</div>
        <div className="statValue">{stats.help}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Lapor Orang Lain</div>
        <div className="statValue">{stats.unreachable}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Total</div>
        <div className="statValue">{stats.total}</div>
      </div>
    </div>
  );
}
