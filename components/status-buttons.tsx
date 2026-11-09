"use client";

import { setTopicStatus, useProgress } from "@/lib/storage";
import { TopicStatusBadge } from "./topic-status-badge";
import type { TopicStatus } from "@/types";

export const StatusButtons = ({ topicKey }: { topicKey: string }) => {
  const status: TopicStatus = useProgress().topics[topicKey] ?? "unseen";
  const button = (target: TopicStatus, label: string) => (
    <button
      onClick={() => setTopicStatus(topicKey, status === target ? "unseen" : target)}
      aria-pressed={status === target}
      className={`btn btn-sm ${status === target ? "border border-acento bg-acento-suave text-acento" : "btn-ghost"}`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TopicStatusBadge status={status} />
      {button("seen", "Marcar como visto")}
      {button("mastered", "Marcar como dominado")}
    </div>
  );
};

/** Badge que lê o status salvo (para listas). */
export const TopicStatusLabel = ({ topicKey }: { topicKey: string }) => {
  const status: TopicStatus = useProgress().topics[topicKey] ?? "unseen";
  return <TopicStatusBadge status={status} />;
};
