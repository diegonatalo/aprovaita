import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExamSession } from "@/lib/progress";
import type { Question } from "@/types";
import { ExamRunner } from "./exam-runner";

const question = (id: string, answerKey: Question["answerKey"]): Question => ({
  id,
  area: "portugues",
  topicSlug: "concordancia",
  origin: "authored",
  statement: `Enunciado ${id}`,
  choices: [`${id}-a`, `${id}-b`, `${id}-c`, `${id}-d`, `${id}-e`],
  answerKey,
  explanation: "",
});

const bank = { q1: question("q1", 0), q2: question("q2", 1), q3: question("q3", 2) };

const session = (over: Partial<ExamSession> = {}): ExamSession => ({
  mockExam: "A",
  startedAt: "2026-03-01T10:00:00.000Z",
  order: ["q1", "q2", "q3"],
  answers: {},
  flagged: [],
  remainingSeconds: 600,
  durationSeconds: 600,
  current: 0,
  ...over,
});

const SESSION_KEY = "aprovaita:exam-session:v1";
const stored = () => JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as ExamSession | null;

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe("ExamRunner", () => {
  it("responde, navega e grava o andamento a cada ação", async () => {
    render(<ExamRunner initial={session()} bank={bank} onFinished={vi.fn()} />);
    expect(screen.getByText("Enunciado q1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();

    await userEvent.click(screen.getByRole("radio", { name: "q1-a" }));
    expect(screen.getByText(/1\/3 respondidas/)).toBeInTheDocument();
    expect(stored()?.answers).toEqual({ q1: 0 });

    await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getByText("Enunciado q2")).toBeInTheDocument();
    expect(stored()?.current).toBe(1);
  });

  it("marca para revisar e limpa a resposta", async () => {
    render(<ExamRunner initial={session()} bank={bank} onFinished={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Revisar depois" }));
    expect(screen.getByRole("button", { name: "Marcada para revisar" })).toHaveAttribute("aria-pressed", "true");
    expect(stored()?.flagged).toEqual(["q1"]);

    await userEvent.click(screen.getByRole("radio", { name: "q1-b" }));
    await userEvent.click(screen.getByRole("button", { name: "Limpar resposta" }));
    expect(screen.getByText(/0\/3 respondidas/)).toBeInTheDocument();
  });

  it("retoma de onde parou", () => {
    render(<ExamRunner initial={session({ current: 2, answers: { q1: 0 } })} bank={bank} onFinished={vi.fn()} />);
    expect(screen.getByText("Enunciado q3")).toBeInTheDocument();
    expect(screen.getByText(/1\/3 respondidas/)).toBeInTheDocument();
  });

  it("finalizar pede confirmação, avisa as em branco e entrega a nota", async () => {
    const onFinished = vi.fn();
    render(<ExamRunner initial={session({ answers: { q1: 0, q2: 3 } })} bank={bank} onFinished={onFinished} />);
    await userEvent.click(screen.getByRole("button", { name: "Finalizar" }));
    expect(screen.getByRole("alertdialog", { name: "Confirmar finalização" })).toHaveTextContent("1 questão(ões) em branco.");

    await userEvent.click(screen.getByRole("button", { name: "Voltar à prova" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Finalizar" }));
    await userEvent.click(screen.getByRole("button", { name: "Sim, finalizar" }));
    expect(onFinished).toHaveBeenCalledWith(
      expect.objectContaining({ mockExam: "A", correct: 1, total: 3, order: ["q1", "q2", "q3"] }),
    );
    expect(stored()).toBeNull();
  });

  it("pausar esconde a questão até continuar", async () => {
    render(<ExamRunner initial={session()} bank={bank} onFinished={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /Pausar/ }));
    expect(screen.getByText("Prova pausada")).toBeInTheDocument();
    expect(screen.queryByText("Enunciado q1")).toBeNull();
    expect(screen.getAllByRole("button", { name: "Continuar" })).toHaveLength(2);
    await userEvent.click(screen.getAllByRole("button", { name: "Continuar" })[1]);
    expect(screen.getByText("Enunciado q1")).toBeInTheDocument();
  });

  it("quando o tempo acaba, finaliza sozinho", () => {
    vi.useFakeTimers();
    const onFinished = vi.fn();
    render(<ExamRunner initial={session({ remainingSeconds: 2 })} bank={bank} onFinished={onFinished} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onFinished).toHaveBeenCalledTimes(1);
    expect(onFinished.mock.calls[0][0]).toMatchObject({ seconds: 600, correct: 0 });
  });
});
