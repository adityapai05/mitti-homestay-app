import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type ReviewsSummaryRequest = {
  homestayId: string;
  reviews: string[];
};

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const body = (await req.json()) as ReviewsSummaryRequest;

    if (!body || !Array.isArray(body.reviews) || body.reviews.length < 3) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const MAX_REVIEWS = 6;
    const MAX_CHARS_PER_REVIEW = 180;

    const sanitizedReviews = body.reviews
      .filter((r) => typeof r === "string" && r.trim().length > 0)
      .slice(0, MAX_REVIEWS)
      .map((r) => r.slice(0, MAX_CHARS_PER_REVIEW));

    if (sanitizedReviews.length === 0) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const prompt = `
Write EXACTLY two complete sentences summarizing these guest reviews.
Each sentence MUST end with a period.

Focus on hospitality, cleanliness, comfort, and surroundings.
Do not mention people, ratings, numbers, or emojis.
Do not add anything beyond the two sentences.

Reviews:
${sanitizedReviews.map((r) => `- ${r}`).join("\n")}
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
          temperature: 0.25,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini error:", errorText);
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const json = await geminiRes.json();

    const parts = json?.candidates?.[0]?.content?.parts;

    const summary = Array.isArray(parts)
      ? parts
          .map((p) => p.text)
          .join("")
          .trim()
      : null;

    console.log("Gemini Response: ", summary);
    console.log("Finish reason:", json?.candidates?.[0]?.finishReason);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/ai/reviews-summary]", error);
    return NextResponse.json({ summary: null }, { status: 200 });
  }
}
