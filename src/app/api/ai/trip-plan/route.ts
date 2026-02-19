import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type TripPlanRequest = {
  homestayName: string;
  village: string;
  district: string;
  state: string;
  category: string;
  nights: number;
};

type TripPlanResponse = {
  plan: string | null;
  reason?: "QUOTA_EXCEEDED";
};

const EMPTY_RESPONSE: TripPlanResponse = {
  plan: null,
};

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const body = (await req.json()) as Partial<TripPlanRequest>;

    if (
      !body ||
      typeof body.homestayName !== "string" ||
      typeof body.village !== "string" ||
      typeof body.district !== "string" ||
      typeof body.state !== "string" ||
      typeof body.category !== "string" ||
      typeof body.nights !== "number"
    ) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const homestayName = body.homestayName.trim().slice(0, 100);
    const village = body.village.trim().slice(0, 80);
    const district = body.district.trim().slice(0, 80);
    const state = body.state.trim().slice(0, 80);
    const category = body.category.trim().slice(0, 80);
    const nights = Math.max(1, Math.min(7, Math.floor(body.nights)));

    if (!homestayName || !state) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const prompt = `
Create a simple day-by-day itinerary for a rural homestay trip.

Rules:
- Plain text only
- Keep it practical and realistic
- Focus on rural experiences and local pace
- Do not invent specific attractions or false claims
- No exaggeration
- Use "Day 1", "Day 2", etc.
- Keep total response under 1800 characters

Homestay: ${homestayName}
Village: ${village || "Not specified"}
District: ${district || "Not specified"}
State: ${state}
Category: ${category || "Not specified"}
Nights: ${nights}
`;

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();

      if (geminiRes.status === 429) {
        console.error("Gemini quota exceeded:", errorText);
        return NextResponse.json(
          { plan: null, reason: "QUOTA_EXCEEDED" },
          { status: 200 },
        );
      }

      console.error("Gemini error:", errorText);
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const json = await geminiRes.json();
    const parts = json?.candidates?.[0]?.content?.parts;

    const plan = Array.isArray(parts)
      ? parts
          .map((p) => (typeof p?.text === "string" ? p.text : ""))
          .join("")
          .replace(/```/g, "")
          .replace(/\*\*/g, "")
          .trim()
          .slice(0, 3500)
      : "";

    if (!plan) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    return NextResponse.json({ plan }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/ai/trip-plan]", error);
    return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
  }
}
