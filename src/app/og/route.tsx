import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a,#1d4ed8)", color: "white" }}>
        <div style={{ fontSize: 120, fontWeight: 800 }}>XyloPDF</div>
        <div style={{ fontSize: 44, marginTop: 16, opacity: 0.9 }}>Herramientas PDF gratis online</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
