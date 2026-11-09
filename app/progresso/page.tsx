import { Backup } from "@/components/backup";
import { ProgressPanel } from "@/components/progress-panel";
import { listTopics } from "@/lib/content";

export default function Progress() {
  const topics = listTopics().map((t) => ({
    topicKey: `${t.area}/${t.slug}`,
    area: t.area,
    slug: t.slug,
    title: t.title,
  }));
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold">Progresso</h1>
      <ProgressPanel topics={topics} />
      <Backup />
    </div>
  );
}
