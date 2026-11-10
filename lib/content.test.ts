import { describe, expect, it } from "vitest";
import { loadBank } from "@/lib/bank";
import { AREAS, areaTopics, findTopic, listTopics } from "@/lib/content";

describe("conteúdo do banco", () => {
  const topics = listTopics();

  it("encontra tópicos em todas as áreas", () => {
    for (const area of AREAS) {
      expect(areaTopics(area).length, area).toBeGreaterThan(0);
    }
  });

  it("não repete o slug de um tópico dentro da mesma área", () => {
    const keys = topics.map((t) => `${t.area}/${t.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("findTopic acha um tópico existente e devolve undefined para um inexistente", () => {
    const first = topics[0];
    expect(findTopic(first.area, first.slug)).toEqual(first);
    expect(findTopic(first.area, "nao-existe")).toBeUndefined();
  });

  it("todas as questões têm id único, gabarito entre A e E e cinco alternativas", () => {
    const { questions } = loadBank();
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of questions) {
      expect(q.choices, q.id).toHaveLength(5);
      expect(q.answerKey, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answerKey, q.id).toBeLessThanOrEqual(4);
    }
  });

  it("questões de banca informam a fonte", () => {
    const { questions } = loadBank();
    for (const q of questions.filter((item) => item.origin === "exam")) {
      expect(q.source, q.id).toBeDefined();
    }
  });

  it("cada questão pertence ao tópico em que está", () => {
    for (const topic of topics) {
      for (const q of [...topic.authored, ...topic.exam]) {
        expect(q.topicSlug, q.id).toBe(topic.slug);
        expect(q.area, q.id).toBe(topic.area);
      }
    }
  });
});
