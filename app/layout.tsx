import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { RegisterServiceWorker } from "@/components/register-sw";
import { SITE } from "@/lib/site";

const body = Figtree({ variable: "--font-corpo", subsets: ["latin"] });
const title = Bricolage_Grotesque({ variable: "--font-titulo", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Agente Administrativo, Câmara de Itanhaém`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    url: "/",
    title: `${SITE.name} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE.description,
  },
};

// O tipo ThemeColorDescriptor do Next 16.4.5 não lista `media`, mas o Next a aplica na meta theme-color.
export const viewport: Viewport = { themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#06151d" },
  ] as unknown as Viewport["themeColor"] };

// Aplica o tema salvo antes da pintura para evitar flash.
const THEME_SCRIPT = `try{var t=localStorage.getItem('tema');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${title.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-card focus:p-3">
          Pular para o conteúdo
        </a>
        <RegisterServiceWorker />
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
