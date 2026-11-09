import { SimuladoApp } from "@/components/SimuladoApp";
import { carregarBanco } from "@/lib/banco";

export default function Simulado() {
  const { questoes, info } = carregarBanco();
  return <SimuladoApp questoes={questoes} info={info} />;
}
