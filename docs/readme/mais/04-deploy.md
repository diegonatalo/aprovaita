### 🌐 Deploy

O site é 100% estático (`output: "export"`), então roda em qualquer hospedagem, como a Vercel.
Ao publicar, ajuste o endereço em `lib/site.ts`: ele alimenta o `sitemap.xml`, o `robots.txt` e os metadados.
