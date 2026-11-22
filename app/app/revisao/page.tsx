import type { Metadata } from "next";
import { ReviewApp } from "@/components/review-app";
import { loadBank } from "@/lib/bank";

export const metadata: Metadata = { alternates: { canonical: "/app/revisao" } };

export default function ReviewPage() {
  const { questions, info } = loadBank();
  return <ReviewApp questions={questions} info={info} />;
}
