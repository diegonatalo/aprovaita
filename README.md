<!-- Arquivo gerado pelo readme-kit. Não edite aqui: altere docs/readme/ e rode "readme-kit build". -->
<div align="center">

<img src="docs/assets/banner.svg" alt="Aprova Ita: Estude para a Câmara de Itanhaém direto do celular. github.com/diegonatalo/AprovaIta. Stack: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4" width="100%" />

<br />

<a href="https://aprovaita.vercel.app"><img src="docs/assets/btn-demo.svg" alt="Abrir o app ↗" height="46" /></a>
<a href="https://github.com/diegonatalo/AprovaIta"><img src="docs/assets/btn-code.svg" alt="Código ↗" height="46" /></a>

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Dados no navegador](https://img.shields.io/badge/dados-s%C3%B3_no_seu_navegador-0a6b7c?style=flat-square)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-16a34a?style=flat-square)

</div>

<br />

<div align="center">

<img src="docs/assets/h-sobre.svg" alt="01 · SOBRE: Sobre o projeto" width="100%" />

</div>

**Estude para a Câmara de Itanhaém direto do celular.**<br />
<img src="public/icon.svg" alt="Logo do Aprova Ita: um check branco sobre fundo verde-petróleo, com um sol coral e uma onda" width="84" height="84" />

</div>

Explicações objetivas, questões comentadas, simulados cronometrados e um caderno que lembra o que você errou.

Site de estudos para o **Concurso nº 01/2026 da Câmara Municipal de Itanhaém**
(cargo Agente Administrativo, banca VUNESP, prova em 06/12/2026).
São 40 questões: 8 de Português, 5 de Matemática, 3 de Legislação Municipal e 24 de Conhecimentos Específicos.

<br />

<div align="center">

<img src="docs/assets/h-demo.svg" alt="02 · DEMO: Demonstração" width="100%" />

</div>

<div align="center">

<sub>Capturas com progresso fictício, só para demonstração.</sub>

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/assets/shot-01.svg" /><img src="docs/assets/shot-01-light.svg" alt="Tela inicial do Aprova Ita: contagem regressiva para a prova, progresso geral e áreas de estudo" width="100%" /></picture>

<br />

<img src="docs/assets/shot-02.svg" alt="Lista de tópicos de Língua Portuguesa com o status de cada um: dominado, visto ou não visto" width="100%" />
<br />
<sub><b>Estudar</b>: os tópicos de cada área, com o seu status.</sub>

<br />

<img src="docs/assets/shot-03.svg" alt="Painel de progresso com próximo passo sugerido e desempenho por área" width="100%" />
<br />
<sub><b>Progresso</b>: desempenho por área e o próximo passo sugerido.</sub>

<br />

<img src="docs/assets/shot-04.svg" alt="Página de um tópico no celular, com botões para marcar como visto ou dominado, e simulado no celular com cronômetro, questão e alternativas" width="100%" />
<br />
<sub><b>Tópico no celular</b>: explicação objetiva, com a barra de abas embaixo. <b>Simulado</b>: cronômetro, questão e alternativas ao alcance do polegar.</sub>

</div>

<br />

<div align="center">

<img src="docs/assets/h-func.svg" alt="03 · FUNCIONALIDADES: O que dá para fazer" width="100%" />

</div>

<div align="center">

<img src="docs/assets/f-01.svg" alt="Funcionalidade 01: Estudar por área. 47 tópicos em Português, Matemática, Legislação e Específicos, cada um com explicação e questões." width="49%" />
<img src="docs/assets/f-02.svg" alt="Funcionalidade 02: Quiz por tópico. Quiz A com questões autorais e Quiz B com questões reais da VUNESP, com gabarito comentado." width="49%" />
<br />
<img src="docs/assets/f-03.svg" alt="Funcionalidade 03: Simulados. Prova de 40 questões com cronômetro de 3h, pausa, marcação para revisar e folha de respostas." width="49%" />
<img src="docs/assets/f-04.svg" alt="Funcionalidade 04: Nota como no edital. Acertos × 100 ÷ 40, com aviso de habilitação (nota mínima 50)." width="49%" />
<br />
<img src="docs/assets/f-05.svg" alt="Funcionalidade 05: Caderno de erros. Tudo o que você errou fica guardado. Acertou ao refazer? A questão sai do caderno." width="49%" />
<img src="docs/assets/f-06.svg" alt="Funcionalidade 06: Progresso. Tópicos vistos e dominados, desempenho por área, pontos fracos e próximo passo sugerido." width="49%" />
<br />
<img src="docs/assets/f-07.svg" alt="Funcionalidade 07: Contagem regressiva. Quantos dias faltam para a prova, na tela inicial." width="49%" />
<img src="docs/assets/f-08.svg" alt="Funcionalidade 08: Tema claro e escuro. Segue o tema do aparelho e dá para trocar na hora." width="49%" />

</div>

<br />

<div align="center">

<img src="docs/assets/h-stack.svg" alt="04 · STACK: Stack" width="100%" />

</div>

<div align="center">

<img src="docs/assets/stack.svg" alt="Stack: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, react-markdown, remark-gfm, gray-matter, tsx, ESLint 9" width="100%" />

</div>

<br />

<div align="center">

<img src="docs/assets/h-run.svg" alt="05 · COMO RODAR: Rodando localmente" width="100%" />

</div>

Requer [Node.js](https://nodejs.org) e npm.

```bash
git clone https://github.com/diegonatalo/AprovaIta.git
cd AprovaIta
npm install
npm run dev        # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `out/` |
| `npm run lint` | Roda o ESLint |
| `npm run validate` | Confere o conteúdo: fontes, gabaritos e alternativas (`validate:strict` trata avisos como erros) |
| `npm run test:motor` | Testa a correção e a montagem dos simulados |

<br />

<div align="center">

<img src="docs/assets/h-estrutura.svg" alt="06 · ESTRUTURA: Estrutura" width="100%" />

</div>

```text
src/
├── app/          rotas: início, conteúdo, simulado, revisão e progresso
├── components/   interface: navegação, questões, prova, painéis
└── lib/          carga do conteúdo, correção, simulados e armazenamento local
content/          um tópico por pasta: explicação e questões
config/           parâmetros da prova (prova.ts) e identidade do site (site.ts)
scripts/          validação do conteúdo e testes do motor
public/           ícone, manifest e service worker
docs/             capturas de tela usadas neste README
```

<br />

<div align="center">

<img src="docs/assets/h-mais.svg" alt="07 · MAIS: Mais informações" width="100%" />

</div>

### 🔒 Seus dados

Não há conta nem servidor. Seu progresso, os simulados e o caderno de erros ficam no
`localStorage` do navegador. Depois da primeira visita, o site também abre sem internet.

Para trocar de aparelho ou não perder nada ao limpar o navegador, use **Progresso → Backup**:
exporte um arquivo JSON e importe no outro lugar.

### 🧠 Como funciona

| Conceito | Regra |
|---|---|
| **Nota** | `acertos × 100 ÷ 40`. Habilitado com nota igual ou maior que 50 (20 acertos). |
| **Simulado completo** | 40 questões na proporção da prova. Prefere questões que você ainda não fez. |
| **Simulado reduzido** | Se o banco não cobre algum grupo, o simulado sai menor e a nota **não** é comparável ao corte. |
| **Cronômetro** | Calculado pelo relógio, então não perde tempo se a aba ficar em segundo plano. |
| **Prova em andamento** | Fica salva. Você pode recarregar a página e retomar de onde parou. |

### 📚 Sobre o conteúdo

> [!NOTE]
> O conteúdo foi produzido com apoio de IA e **não substitui o edital nem as normas oficiais**.
> Confira os pontos marcados com `VERIFICAR` antes de decorar.

- **Questões da banca** só entram quando vêm de provas reais da VUNESP e têm fonte. Os gabaritos usados
  são os preliminares; mudanças após recursos não foram conferidas.
- **Questões autorais** são identificadas como tal na tela.
- **Legislação municipal:** ainda não há questões reais da banca para esse grupo.
- **Divisão dos 24 Específicos** entre Administração Geral (10), Arquivologia (6) e Administração Pública (8)
  é uma suposição, porque o edital não informa. Ela fica em `config/prova.ts` e pode ser mudada.
- Alguns tópicos estão marcados como "fora do programa do edital" e ficam sinalizados no site.

<details>
<summary><b>Como adicionar um tópico</b></summary>

1. Crie a pasta `content/<area>/<topico>/` (em Específicos, dentro da subárea).
2. Escreva `explicacao.mdx` com `titulo`, `ordem` e `resumo` no cabeçalho.
3. Adicione `questoes-autorais.json` (Quiz A) e, se houver prova real com fonte, `questoes-banca.json` (Quiz B).
4. Rode `npm run validate` e corrija o que ele apontar.

</details>

### 🌐 Deploy

O site é 100% estático (`output: "export"`), então roda em qualquer hospedagem, como a Vercel.
Ao publicar, ajuste o endereço em `config/site.ts`: ele alimenta o `sitemap.xml`, o `robots.txt` e os metadados.

### 🧭 Próximos passos

- [ ] Questões reais da banca para Legislação Municipal (falta prova de Câmara que cubra o tema).
- [ ] Conferir se houve mudança de gabarito após recursos nas provas usadas.
- [ ] Confirmar o horário exato da prova no edital.
- [ ] Definir o endereço público e atualizar `config/site.ts`.
- [ ] Testes automatizados da interface (hoje só há validação do conteúdo e teste do motor).

### 📄 Créditos e licença

- Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE).

<br />

<div align="center">

<img src="docs/assets/h-autor.svg" alt="08 · AUTOR: Autor" width="100%" />

</div>

<div align="center">

<a href="https://diegonatalo.dev"><img src="docs/assets/btn-portfolio.svg" alt="Portfólio ↗" height="46" /></a>
<a href="https://www.linkedin.com/in/diegonatalo/"><img src="docs/assets/btn-linkedin.svg" alt="LinkedIn ↗" height="46" /></a>
<a href="https://github.com/diegonatalo"><img src="docs/assets/btn-github.svg" alt="GitHub ↗" height="46" /></a>

</div>

<br />

<div align="center">

<img src="docs/assets/footer.svg" alt="© 2026 Diego Natalo. Feito com 💚 para quem estuda no ônibus, na fila e na hora do almoço." width="100%" />

</div>
