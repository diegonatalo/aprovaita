import { Nav } from "@/components/nav";

/** O app (estudo, simulado, erros e progresso) mora em `/app`; a landing fica em `/`. */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <Nav />
      <div className="md:pl-64">
        <main
          id="conteudo"
          className="enter pb-tab-bar mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:max-w-5xl lg:px-10 lg:pt-10"
        >
          {children}
        </main>
      </div>
    </>
  );
}
