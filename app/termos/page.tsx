import type { Metadata } from "next";
import { TermsPage } from "@/components/legal-pages";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "As regras para usar o Aprova Ita, material de estudo independente.",
  alternates: { canonical: "/termos" },
};

export default function Page() {
  return <TermsPage />;
}
