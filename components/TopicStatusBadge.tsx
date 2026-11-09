import type { StatusTopico } from "@/lib/tipos";

const ROTULO: Record<StatusTopico, string> = {
  "nao-visto": "Não visto",
  visto: "Visto",
  dominado: "Dominado",
};
const COR: Record<StatusTopico, string> = {
  "nao-visto": "border-borda text-muted",
  visto: "border-aviso/50 bg-aviso/10 text-aviso",
  dominado: "border-acerto/50 bg-acerto/10 text-acerto",
};

export function TopicStatusBadge({ status }: { status: StatusTopico }) {
  return (
    <span className={`inline-block shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${COR[status]}`}>
      {ROTULO[status]}
    </span>
  );
}
