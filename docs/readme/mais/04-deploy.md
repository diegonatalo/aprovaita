### 🌐 Deploy

O site é publicado na Vercel. Todas as páginas são geradas no build (sem servidor próprio), e as de conteúdo vêm de `generateStaticParams`.
Ao publicar, ajuste o endereço em `lib/site.ts`: ele alimenta o `sitemap.xml`, o `robots.txt` e os metadados.
