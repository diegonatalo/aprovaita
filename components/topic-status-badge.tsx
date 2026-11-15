import type { TopicStatus } from "@/types";

const LABEL: Record<TopicStatus, string> = {
  "unseen": "Não visto",
  seen: "Visto",
  mastered: "Dominado",
};
const COLOR: Record<TopicStatus, string> = {
  "unseen": "border-border text-muted",
  seen: "border-warning/50 bg-warning/10 text-warning",
  mastered: "border-correct/50 bg-correct/10 text-correct",
};

export const TopicStatusBadge = ({ status }: { status: TopicStatus }) => {
  return (
    <span className={`inline-block shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${COLOR[status]}`}>
      {LABEL[status]}
    </span>
  );
};
