import { Backup } from "@/components/Backup";
import { PainelProgresso } from "@/components/PainelProgresso";
import { listarTopicos } from "@/lib/content";

export default function Progresso() {
  const topicos = listarTopicos().map((t) => ({
    chave: `${t.area}/${t.slug}`,
    area: t.area,
    slug: t.slug,
    titulo: t.titulo,
  }));
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold">Progresso</h1>
      <PainelProgresso topicos={topicos} />
      <Backup />
    </div>
  );
}
