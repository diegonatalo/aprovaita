import { ReviewApp } from "@/components/review-app";
import { loadBank } from "@/lib/bank";

export default function ReviewPage() {
  const { questions, info } = loadBank();
  return <ReviewApp questions={questions} info={info} />;
}
