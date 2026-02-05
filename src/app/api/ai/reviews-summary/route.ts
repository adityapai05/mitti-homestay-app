import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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

    const MAX_REVIEWS = 12;
    const MAX_CHARS_PER_REVIEW = 300;

    const sanitizedReviews = body.reviews
      .filter((r) => typeof r === "string" && r.trim().length > 0)
      .slice(0, MAX_REVIEWS)
      .map((r) => r.slice(0, MAX_CHARS_PER_REVIEW));

    if (sanitizedReviews.length === 0) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const prompt = `
You are summarizing guest reviews for a rural homestay booking platform.

Write a neutral, trustworthy summary in 2 short sentences.
Focus on:
- hospitality
- cleanliness
- comfort
- surroundings or location

Rules:
- Do not mention individual people
- Do not exaggerate
- Do not use emojis
- Do not mention ratings or numbers

Guest reviews:
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
          temperature: 0.4,
          maxOutputTokens: 120,
        },
      }),
    });

    if (!geminiRes.ok) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    const json = await geminiRes.json();

    const summary: string | undefined =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json(
      { summary: summary?.trim() || null },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/ai/reviews-summary]", error);
    return NextResponse.json({ summary: null }, { status: 200 });
  }
}
