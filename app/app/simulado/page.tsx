import type { Metadata } from "next";
import { MockExamApp } from "@/components/mock-exam-app";
import { loadBank } from "@/lib/bank";

export const metadata: Metadata = { alternates: { canonical: "/app/simulado" } };

export default function MockExamPage() {
  const { questions, info } = loadBank();
  return <MockExamApp questions={questions} info={info} />;
}
