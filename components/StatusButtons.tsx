"use client";

import { definirStatus, useProgresso } from "@/lib/storage";
import { TopicStatusBadge } from "./TopicStatusBadge";
import type { StatusTopico } from "@/lib/tipos";

export function StatusButtons({ chave }: { chave: string }) {
  const status: StatusTopico = useProgresso().topicos[chave] ?? "nao-visto";
  const botao = (alvo: StatusTopico, rotulo: string) => (
    <button
      onClick={() => definirStatus(chave, status === alvo ? "nao-visto" : alvo)}
      aria-pressed={status === alvo}
      className={`btn btn-sm ${status === alvo ? "border border-acento bg-acento-suave text-acento" : "btn-ghost"}`}
    >
      {rotulo}
    </button>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TopicStatusBadge status={status} />
      {botao("visto", "Marcar como visto")}
      {botao("dominado", "Marcar como dominado")}
    </div>
  );
}

/** Badge que lê o status salvo (para listas). */
export function StatusDoTopico({ chave }: { chave: string }) {
  const status: StatusTopico = useProgresso().topicos[chave] ?? "nao-visto";
  return <TopicStatusBadge status={status} />;
}
