import { ImageResponse } from "next/og";

/** Shared Open Graph / Twitter card artwork in the Monaco Night palette. */
export function renderSocialImage(size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0c0b",
          color: "#efeadf",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 12, color: "#d8b862" }}>RISE WEBSITES</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, letterSpacing: 2 }}>
          <span>WEBSITES BUILT TO</span>
          <span style={{ color: "#d8b862" }}>GROW YOUR BUSINESS.</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 64,
            paddingLeft: 28,
            borderTop: "2px solid #d8b862",
            borderBottom: "2px solid #d8b862",
            background: "#0f3d27",
            fontSize: 26,
            color: "#efeadf",
          }}
        >
          Custom websites for local businesses · Launch in 2–4 weeks
        </div>
      </div>
    ),
    size,
  );
}
