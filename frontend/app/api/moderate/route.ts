import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const res = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // server-side key
      },
      body: JSON.stringify({ input: text }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Moderation proxy error:", e);
    return NextResponse.json({ results: [{ flagged: false }] }, { status: 500 });
  }
}
