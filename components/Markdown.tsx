import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderiza Markdown (explicações e enunciados). Tabelas ganham rolagem horizontal no celular. */
export function Markdown({
  children,
  className = "",
  inline = false,
}: {
  children: string;
  className?: string;
  /** Sem parágrafos: para trechos curtos dentro de outro elemento (alternativas). */
  inline?: boolean;
}) {
  const Raiz = inline ? "span" : "div";
  return (
    <Raiz className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...(inline ? { p: ({ children }) => <>{children}</> } : {}),
          table: ({ children }) => (
            <div className="tabela">
              <table>{children}</table>
            </div>
          ),
          input: ({ type, checked }) =>
            type === "checkbox" ? (
              <input type="checkbox" checked={checked} disabled readOnly className="mr-2" />
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </Raiz>
  );
}
