import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type EnhanceDescriptionRequest = {
  description: string;
  category: string;
  location: string;
};

type EnhanceDescriptionResponse = {
  enhanced: string | null;
  reason?: "QUOTA_EXCEEDED";
};

const EMPTY_RESPONSE: EnhanceDescriptionResponse = {
  enhanced: null,
};

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const body = (await req.json()) as Partial<EnhanceDescriptionRequest>;

    if (
      !body ||
      typeof body.description !== "string" ||
      typeof body.category !== "string" ||
      typeof body.location !== "string"
    ) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const description = body.description.trim().slice(0, 500);
    const category = body.category.trim().slice(0, 80);
    const location = body.location.trim().slice(0, 120);

    if (description.length < 20) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const prompt = `
Improve this homestay description while keeping it factual and grounded.

Rules:
- Keep facts aligned strictly with the provided input
- No exaggeration
- 90 to 140 words
- No emojis
- No markdown
- Return plain text only

Category: ${category || "Not specified"}
Location: ${location || "Not specified"}

Description:
${description}
`;

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();

      if (geminiRes.status === 429) {
        console.error("Gemini quota exceeded:", errorText);
        return NextResponse.json(
          { enhanced: null, reason: "QUOTA_EXCEEDED" },
          { status: 200 },
        );
      }

      console.error("Gemini error:", errorText);
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const json = await geminiRes.json();
    const parts = json?.candidates?.[0]?.content?.parts;

    const enhanced = Array.isArray(parts)
      ? parts
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("")
          .replace(/```/g, "")
          .trim()
          .slice(0, 500)
      : "";

    if (!enhanced) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    return NextResponse.json({ enhanced }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/ai/enhance-description]", error);
    return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
  }
}
