### 📚 Sobre o conteúdo

> [!NOTE]
> O conteúdo foi produzido com apoio de IA e **não substitui o edital nem as normas oficiais**.
> Confira os pontos marcados com `VERIFICAR` antes de decorar.

- **Questões da banca** só entram quando vêm de provas reais da VUNESP e têm fonte. Os gabaritos usados
  são os preliminares; mudanças após recursos não foram conferidas.
- **Questões autorais** são identificadas como tal na tela.
- **Legislação municipal:** ainda não há questões reais da banca para esse grupo.
- **Divisão dos 24 Específicos** entre Administração Geral (10), Arquivologia (6) e Administração Pública (8)
  é uma suposição, porque o edital não informa. Ela fica em `lib/exam.ts` e pode ser mudada.
- Alguns tópicos estão marcados como "fora do programa do edital" e ficam sinalizados no site.

<details>
<summary><b>Como adicionar um tópico</b></summary>

1. Crie a pasta `content/<area>/<topico>/` (em Específicos, dentro da subárea).
2. Escreva `explicacao.mdx` com `title`, `order` e `summary` no cabeçalho.
3. Adicione `questoes-autorais.json` (Quiz A) e, se houver prova real com fonte, `questoes-banca.json` (Quiz B).
4. Rode `pnpm validate` e corrija o que ele apontar.

</details>
