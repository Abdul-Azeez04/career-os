import { ImageResponse } from "next/og"
import { getSiteConfig } from "@/lib/data"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")
    const config = await getSiteConfig()

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0A0A0B",
            backgroundImage: "radial-gradient(circle at 25px 25px, #2A2A2D 2%, transparent 0%), radial-gradient(circle at 75px 75px, #2A2A2D 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#141416",
              border: "2px solid #2A2A2D",
              borderRadius: "24px",
              padding: "60px",
              width: "100%",
              height: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  backgroundColor: "#D4A853",
                  color: "#0A0A0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginRight: "20px",
                }}
              >
                {config.owner_name[0]}
              </div>
              <div style={{ fontSize: "32px", color: "#8A8A8E", letterSpacing: "2px" }}>
                {config.owner_name}
              </div>
            </div>

            <div
              style={{
                fontSize: title ? "72px" : "96px",
                fontWeight: "bold",
                color: "#EDEDEF",
                textAlign: "center",
                lineHeight: 1.1,
                marginBottom: title ? "40px" : "20px",
              }}
            >
              {title || config.owner_name}
            </div>

            <div
              style={{
                fontSize: title ? "32px" : "40px",
                color: "#D4A853",
                textAlign: "center",
              }}
            >
              {title ? config.owner_name : config.tagline}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 })
  }
}
