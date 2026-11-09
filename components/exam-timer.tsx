import { formatTime } from "@/lib/format";

export const ExamTimer = ({
  remaining,
  paused,
  onTogglePause,
}: {
  remaining: number;
  paused: boolean;
  onTogglePause: () => void;
}) => {
  const alert = remaining <= 600;
  return (
    <div className="flex items-center gap-3">
      <span
        role="timer"
        aria-label="Tempo restante"
        className={`font-display text-2xl font-extrabold tabular-nums ${alert ? "text-erro" : ""}`}
      >
        {formatTime(remaining)}
      </span>
      <button onClick={onTogglePause} className="btn btn-ghost btn-sm text-sm">
        {paused ? "Continuar" : "Pausar"}
      </button>
    </div>
  );
};
