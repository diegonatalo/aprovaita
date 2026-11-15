import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { TopicInfo } from "@/lib/bank";
import { recordMistakes } from "@/lib/storage";
import type { Question } from "@/types";
import { ReviewApp } from "./review-app";

const question = (id: string, area: Question["area"], topicSlug: string, answerKey: Question["answerKey"]): Question => ({
  id,
  area,
  topicSlug,
  origin: "authored",
  statement: `Enunciado ${id}`,
  choices: [`${id}-a`, `${id}-b`, `${id}-c`, `${id}-d`, `${id}-e`],
  answerKey,
  explanation: "",
});

const questions = [
  question("p1", "portugues", "crase", 0),
  question("p2", "portugues", "crase", 1),
  question("m1", "matematica", "porcentagem", 2),
  question("ok", "matematica", "porcentagem", 0),
];

const info: Record<string, TopicInfo> = {
  "portugues/crase": { title: "Crase", area: "portugues" },
  "matematica/porcentagem": { title: "Porcentagem", area: "matematica" },
};

const begin = () => userEvent.click(screen.getByRole("button", { name: /Refazer só os erros/ }));

beforeEach(() => {
  localStorage.clear();
  recordMistakes(["p1", "p2", "m1"], []);
});

describe("ReviewApp", () => {
  it("lista só as questões do caderno de erros", () => {
    render(<ReviewApp questions={questions} info={info} />);
    expect(screen.getByText(/3 questão\(ões\) errada\(s\)/)).toBeInTheDocument();
    expect(screen.queryByText("Enunciado ok")).toBeNull();
    expect(screen.getByRole("button", { name: "Refazer só os erros (3)" })).toBeEnabled();
  });

  it("filtra por área e mostra só os tópicos dela", async () => {
    render(<ReviewApp questions={questions} info={info} />);
    await userEvent.selectOptions(screen.getByLabelText("Área"), "matematica");
    expect(screen.getByRole("button", { name: "Refazer só os erros (1)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Porcentagem" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Crase" })).toBeNull();
  });

  it("caderno vazio para o filtro não deixa começar", async () => {
    localStorage.clear();
    render(<ReviewApp questions={questions} info={info} />);
    expect(screen.getByText("Nada no caderno para este filtro.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refazer só os erros (0)" })).toBeDisabled();
  });

  it("refazer: corrige só com tudo respondido e tira as acertadas do caderno", async () => {
    render(<ReviewApp questions={questions} info={info} />);
    await userEvent.selectOptions(screen.getByLabelText("Área"), "portugues");
    await begin();
    expect(screen.getByRole("heading", { name: "Refazer erros" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "p1-a" }));
    expect(screen.getByRole("button", { name: "Corrigir" })).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "p2-a" }));
    await userEvent.click(screen.getByRole("button", { name: "Corrigir" }));
    expect(screen.getByText(/Você acertou 1 de 2/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "← Voltar ao caderno" }));
    expect(screen.getByText(/2 questão\(ões\) errada\(s\)/)).toBeInTheDocument();
    expect(screen.queryByText("Enunciado p1")).toBeNull();
  });
});
