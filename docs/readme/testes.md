### 🧪 Testes

```bash
pnpm test
```

Usa [Vitest](https://vitest.dev). Os testes cobrem o banco de questões (estrutura e consistência do conteúdo), a correção e a nota, a montagem dos simulados, o formatador de tempo e nota e o salvamento e a importação do progresso. O motor dos simulados tem também um script próprio, `pnpm test:engine`.

Para reexecutar ao salvar: `pnpm test:watch`.

Os testes de ponta a ponta (Playwright, em `e2e/`) abrem o app no Chromium e percorrem os fluxos inteiros: marcar um tópico como visto, corrigir um quiz e ver o erro no caderno, retomar um simulado depois de recarregar, exportar e importar o progresso, e abrir as páginas sem erros.

```bash
pnpm exec playwright install chromium   # só na primeira vez
pnpm test:e2e                           # gera o build e testa contra ele
```
