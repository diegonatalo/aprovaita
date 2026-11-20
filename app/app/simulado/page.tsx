import { MockExamApp } from "@/components/mock-exam-app";
import { loadBank } from "@/lib/bank";

export default function MockExamPage() {
  const { questions, info } = loadBank();
  return <MockExamApp questions={questions} info={info} />;
}
