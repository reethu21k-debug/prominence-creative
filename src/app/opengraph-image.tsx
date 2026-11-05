import { ImageResponse } from "next/og";

export const alt = "Prominence Creative";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Typographic placeholder card until a real brand image is supplied.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", height: "100%", background: "#090909", color: "#ffffff", padding: 80 }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#707070" }}>Creative production</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 104, letterSpacing: -3, textTransform: "uppercase", lineHeight: 1 }}>Prominence Creative</div>
      </div>
    ),
    size,
  );
}
