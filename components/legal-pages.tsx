import Link from "next/link";
import { PublicFooter, PublicHeader } from "@/components/landing/landing-page";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY_EMAIL, SOURCE_URL } from "@/lib/site";

/** Data da última mudança nos textos (`AAAA-MM-DD`). */
const UPDATED_AT = "2026-11-20";

const linkClass = "font-semibold text-accent underline underline-offset-2";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <PublicHeader />
    {children}
    <PublicFooter />
  </div>
);

const Contact = () => (
  <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass}>
    {PRIVACY_EMAIL}
  </a>
);

export const PrivacyPage = () => (
  <Shell>
    <LegalPage
      title="Privacidade"
      summary="O Aprova Ita guarda o seu progresso só no seu navegador. Nada do que você estuda ou responde vai para um servidor."
      updatedAt={UPDATED_AT}
      sections={[
        {
          id: "o-que-fica-guardado",
          title: "O que fica guardado",
          content: (
            <>
              <p>
                Os tópicos que você marcou como estudados, os resultados dos questionários, o caderno de erros, os
                simulados (inclusive um em andamento) e a sua escolha de tema claro ou escuro.
              </p>
              <p>
                Tudo fica no armazenamento deste navegador (localStorage). Para funcionar sem internet, o app também
                guarda uma cópia das páginas visitadas no navegador. Nós não temos acesso a nada disso.
              </p>
            </>
          ),
        },
        {
          id: "terceiros",
          title: "Quem mais recebe dados",
          content: (
            <p>
              Só a <strong>Vercel</strong>, a hospedagem do site, que registra dados técnicos de acesso (como IP e
              navegador) para entregar as páginas. Não usamos cookies, estatísticas de visita nem propaganda.
            </p>
          ),
        },
        {
          id: "backup",
          title: "Backup",
          content: (
            <p>
              O backup (em Progresso) leva os tópicos estudados, os questionários, o caderno de erros e os simulados.
              Depois de baixado, o arquivo fica sob o seu cuidado.
            </p>
          ),
        },
        {
          id: "como-apagar",
          title: "Como apagar",
          content: (
            <p>
              Limpe os dados deste site nas configurações do navegador. O progresso é apagado de vez e só volta se
              você tiver um backup.
            </p>
          ),
        },
        {
          id: "contato",
          title: "Contato",
          content: (
            <p>
              Dúvidas sobre esta página: <Contact />.
            </p>
          ),
        },
      ]}
    />
  </Shell>
);

export const TermsPage = () => (
  <Shell>
    <LegalPage
      title="Termos de uso"
      summary="As regras para usar o Aprova Ita. Ao usar o app, você concorda com elas."
      updatedAt={UPDATED_AT}
      sections={[
        {
          id: "o-que-e",
          title: "O que é o Aprova Ita",
          content: (
            <p>
              Um material de estudo gratuito e independente para o concurso da Câmara de Itanhaém, mantido por Diego
              Natalo como projeto pessoal. O código é aberto, no{" "}
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
              .
            </p>
          ),
        },
        {
          id: "nao-e-oficial",
          title: "Não é oficial",
          content: (
            <p>
              O Aprova Ita não tem ligação com a Câmara Municipal de Itanhaém nem com a VUNESP. O conteúdo pode ter
              erros ou ficar desatualizado, e não há garantia de aprovação. Datas, regras e conteúdo valem como estão
              no edital oficial: confira sempre.
            </p>
          ),
        },
        {
          id: "seus-dados",
          title: "Seus dados",
          content: (
            <p>
              O progresso fica só no seu navegador, e fazer backup é responsabilidade sua. Detalhes em{" "}
              <Link href="/privacidade" className={linkClass}>
                Privacidade
              </Link>
              .
            </p>
          ),
        },
        {
          id: "disponibilidade",
          title: "Disponibilidade",
          content: (
            <p>
              O Aprova Ita é oferecido &quot;como está&quot;, sem garantia de que vai funcionar sempre ou sem erros. Ele
              pode mudar ou sair do ar.
            </p>
          ),
        },
        {
          id: "contato",
          title: "Contato",
          content: (
            <p>
              <Contact />
            </p>
          ),
        },
      ]}
    />
  </Shell>
);
