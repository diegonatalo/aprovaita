Requer [Node.js](https://nodejs.org) e [pnpm](https://pnpm.io).

```bash
git clone https://github.com/diegonatalo/aprovaita.git
cd aprovaita
pnpm install
pnpm dev        # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Gera o site estático em `out/` |
| `pnpm lint` | Roda o ESLint |
| `pnpm validate` | Confere o conteúdo: fontes, gabaritos e alternativas (`validate:strict` trata avisos como erros) |
| `pnpm test:motor` | Testa a correção e a montagem dos simulados |
