Requer [Node.js](https://nodejs.org) e npm.

```bash
git clone https://github.com/diegonatalo/aprovaita.git
cd aprovaita
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
