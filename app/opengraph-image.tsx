import { ImageResponse } from "next/og";
import { EXAM } from "@/lib/exam";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: estudos para Agente Administrativo da Câmara de Itanhaém`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #0f8396 0%, #0a3a4f 100%)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -90, right: -70, width: 340, height: 340, borderRadius: 340, background: "#ff8a63" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#ffffff22" />
            <path d="m16 33 10 10 22-22" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 800 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Agente Administrativo da Câmara de Itanhaém
          </div>
          <div style={{ fontSize: 34, opacity: 0.85 }}>
            {`Conteúdo, questões comentadas e simulados · ${EXAM.exam}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
