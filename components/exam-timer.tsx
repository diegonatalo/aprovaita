import { formatarTempo } from "@/lib/formato";

export function ExamTimer({
  restante,
  pausado,
  onAlternarPausa,
}: {
  restante: number;
  pausado: boolean;
  onAlternarPausa: () => void;
}) {
  const alerta = restante <= 600;
  return (
    <div className="flex items-center gap-3">
      <span
        role="timer"
        aria-label="Tempo restante"
        className={`font-display text-2xl font-extrabold tabular-nums ${alerta ? "text-erro" : ""}`}
      >
        {formatarTempo(restante)}
      </span>
      <button onClick={onAlternarPausa} className="btn btn-ghost btn-sm text-sm">
        {pausado ? "Continuar" : "Pausar"}
      </button>
    </div>
  );
}
