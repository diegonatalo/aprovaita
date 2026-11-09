import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { RegistrarSW } from "@/components/RegistrarSW";
import { SITE } from "@/config/site";

const corpo = Figtree({ variable: "--font-corpo", subsets: ["latin"] });
const titulo = Bricolage_Grotesque({ variable: "--font-titulo", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.nome} — Agente Administrativo, Câmara de Itanhaém`, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  applicationName: SITE.nome,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    url: "/",
    title: `${SITE.nome} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.nome} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE.descricao,
  },
};

export const viewport: Viewport = { themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#06151d" },
  ] };

// Aplica o tema salvo antes da pintura para evitar flash.
const SCRIPT_TEMA = `try{var t=localStorage.getItem('tema');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${corpo.variable} ${titulo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-screen">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-card focus:p-3">
          Pular para o conteúdo
        </a>
        <RegistrarSW />
        <Nav />
        <div className="lg:pl-64">
          <main id="conteudo" className="entrada pb-barra mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:max-w-5xl lg:px-10 lg:pt-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
