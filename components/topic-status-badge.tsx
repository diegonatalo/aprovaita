import type { TopicStatus } from "@/types";

const LABEL: Record<TopicStatus, string> = {
  "unseen": "Não visto",
  seen: "Visto",
  mastered: "Dominado",
};
const COLOR: Record<TopicStatus, string> = {
  "unseen": "border-borda text-muted",
  seen: "border-aviso/50 bg-aviso/10 text-aviso",
  mastered: "border-acerto/50 bg-acerto/10 text-acerto",
};

export const TopicStatusBadge = ({ status }: { status: TopicStatus }) => {
  return (
    <span className={`inline-block shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${COLOR[status]}`}>
      {LABEL[status]}
    </span>
  );
};
