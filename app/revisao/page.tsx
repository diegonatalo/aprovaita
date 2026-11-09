import { RevisaoApp } from "@/components/RevisaoApp";
import { carregarBanco } from "@/lib/banco";

export default function Revisao() {
  const { questoes, info } = carregarBanco();
  return <RevisaoApp questoes={questoes} info={info} />;
}
