export function ProgressRing({
  valor,
  tamanho = 72,
  rotulo,
}: {
  valor: number; // 0–100
  tamanho?: number;
  rotulo?: string;
}) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div
      role="img"
      aria-label={`${rotulo ?? "Progresso"}: ${Math.round(v)}%`}
      className="relative inline-flex items-center justify-center"
      style={{ width: tamanho, height: tamanho }}
    >
      <svg viewBox="0 0 40 40" className="-rotate-90" width={tamanho} height={tamanho}>
        <circle cx="20" cy="20" r={r} fill="none" stroke="var(--borda)" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="var(--acento)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
        />
      </svg>
      <span className="absolute font-display text-sm font-bold">{Math.round(v)}%</span>
    </div>
  );
}
