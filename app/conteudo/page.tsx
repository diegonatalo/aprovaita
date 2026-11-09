import type { Metadata } from "next";
import { CartoesArea } from "@/components/CartoesArea";

export const metadata: Metadata = { title: "Estudar" };

export default function Estudar() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Conteúdo</p>
        <h1 className="font-display text-3xl font-extrabold">O que vamos estudar hoje?</h1>
        <p className="mt-1 text-muted">Escolha uma área. Cada tópico traz explicação e questões para treinar.</p>
      </header>
      <CartoesArea />
    </div>
  );
}
