"use client";

import { useState } from "react";
import { exportProgress, importProgress } from "@/lib/storage";

export function Backup() {
  const [message, setMessage] = useState("");

  function exportData() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `progresso-concurso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importData(file: File | undefined) {
    if (!file) return;
    const r = importProgress(await file.text());
    setMessage(r.ok ? "Progresso importado." : (r.error ?? "Falha ao importar."));
  }

  return (
    <section className="space-y-3 card p-4">
      <h2 className="font-bold">Backup do progresso</h2>
      <p className="text-sm text-muted">
        O progresso fica só neste navegador. Exporte de vez em quando para não perder nada e para
        levar ao celular.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={exportData} className="btn btn-primary">
          Exportar JSON
        </button>
        <label className="cursor-pointer btn btn-ghost">
          Importar JSON (substitui o atual)
          <input type="file" accept="application/json" className="sr-only" onChange={(e) => importData(e.target.files?.[0])} />
        </label>
      </div>
      {message && <p role="status" className="text-sm">{message}</p>}
    </section>
  );
}
