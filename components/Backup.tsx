"use client";

import { useState } from "react";
import { exportarProgresso, importarProgresso } from "@/lib/storage";

export function Backup() {
  const [msg, setMsg] = useState("");

  function exportar() {
    const blob = new Blob([exportarProgresso()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `progresso-concurso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importar(arquivo: File | undefined) {
    if (!arquivo) return;
    const r = importarProgresso(await arquivo.text());
    setMsg(r.ok ? "Progresso importado." : (r.erro ?? "Falha ao importar."));
  }

  return (
    <section className="space-y-3 card p-4">
      <h2 className="font-bold">Backup do progresso</h2>
      <p className="text-sm text-muted">
        O progresso fica só neste navegador. Exporte de vez em quando para não perder nada e para
        levar ao celular.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={exportar} className="btn btn-primary">
          Exportar JSON
        </button>
        <label className="cursor-pointer btn btn-ghost">
          Importar JSON (substitui o atual)
          <input type="file" accept="application/json" className="sr-only" onChange={(e) => importar(e.target.files?.[0])} />
        </label>
      </div>
      {msg && <p role="status" className="text-sm">{msg}</p>}
    </section>
  );
}
