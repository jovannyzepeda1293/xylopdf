import { ImageResponse } from "next/og";

export const alt = "XyloPDF - Herramientas PDF online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0f172a,#1d4ed8)", color: "white" }}>
        <div style={{ fontSize: 96, fontWeight: 800 }}>XyloPDF</div>
        <div style={{ fontSize: 44, marginTop: 24, opacity: 0.9 }}>Une, divide, convierte y comprime PDF online</div>
        <div style={{ fontSize: 32, marginTop: 40, opacity: 0.7 }}>xylopdf.com</div>
      </div>
    ),
    size
  );
}
