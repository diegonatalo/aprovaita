### 🌐 Deploy

O site é publicado na Vercel. Todas as páginas são geradas no build (sem servidor próprio), e as de conteúdo vêm de `generateStaticParams`.
A landing fica em `/` e o app em `/app`; os endereços antigos sem `/app` (`/conteudo/...`, `/simulado`...) redirecionam com 308 (`lib/redirects.ts`), então links e buscas antigas continuam valendo.
Ao publicar, ajuste o endereço em `lib/site.ts`: ele alimenta o `sitemap.xml`, o `robots.txt` e os metadados.
