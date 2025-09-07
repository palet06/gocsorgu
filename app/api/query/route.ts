import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { kimlikNo } = await request.json()

    if (!kimlikNo) {
      return NextResponse.json({ success: false, message: "Kimlik numarası gerekli" }, { status: 400 })
    }

     const apiEndpoint = process.env.GOC_API_ENDPOINT 
    const apiKey = process.env.GOC_API_KEY

    // Make the actual API call
    const response = await fetch(`${apiEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApiKey: `${apiKey}`,
      },
      body: JSON.stringify({
        fotografGetir: false,
        gecmisListeGetir: true,
        kimlikNo: kimlikNo,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}
