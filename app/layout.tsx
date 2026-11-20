import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-sw";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { themeScript } from "@/lib/theme";

const body = Figtree({ variable: "--font-body", subsets: ["latin"] });
const title = Bricolage_Grotesque({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Agente Administrativo, Câmara de Itanhaém`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Agente Administrativo, Câmara de Itanhaém`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = { themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#06151d" },
  ] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${title.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript(STORAGE_KEYS.theme) }} />
      </head>
      <body className="min-h-screen">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-card focus:p-3">
          Pular para o conteúdo
        </a>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
