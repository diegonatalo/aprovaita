import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaScreen } from "@/components/area-screen";
import { AREAS } from "@/lib/content";
import { AREA_NAMES } from "@/lib/exam";
import type { Area } from "@/types";

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return AREAS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  if (!AREAS.includes(area as Area)) return {};
  return { title: AREA_NAMES[area as Area], alternates: { canonical: `/app/conteudo/${area}` } };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  if (!AREAS.includes(area as Area)) notFound();
  return <AreaScreen area={area as Area} />;
}
