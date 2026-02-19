import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type ReviewsSummaryRequest = {
  homestayId: string;
  reviews: string[];
};

type ReviewsSummaryResponse = {
  summary: string | null;
  positives: string[] | null;
  negatives: string[] | null;
};

const EMPTY_RESPONSE: ReviewsSummaryResponse = {
  summary: null,
  positives: null,
  negatives: null,
};

function normalizeModelJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return trimmed;
}

function parseModelPayload(
  raw: string,
): { summary: string; positives: string[]; negatives: string[] } | null {
  const normalized = normalizeModelJson(raw);

  const candidates = [normalized];
  const firstBrace = normalized.indexOf("{");
  const lastBrace = normalized.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(normalized.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as {
        summary?: unknown;
        positives?: unknown;
        negatives?: unknown;
      };

      if (typeof parsed.summary !== "string" || parsed.summary.trim().length === 0) {
        continue;
      }

      const sanitizeItems = (value: unknown): string[] => {
        if (!Array.isArray(value)) return [];
        return value
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .slice(0, 3);
      };

      return {
        summary: parsed.summary.trim().slice(0, 500),
        positives: sanitizeItems(parsed.positives),
        negatives: sanitizeItems(parsed.negatives),
      };
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const body = (await req.json()) as Partial<ReviewsSummaryRequest>;

    if (
      !body ||
      typeof body.homestayId !== "string" ||
      !Array.isArray(body.reviews) ||
      body.reviews.length < 3
    ) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const MAX_REVIEWS = 6;
    const MAX_CHARS_PER_REVIEW = 180;

    const sanitizedReviews = body.reviews
      .filter((r) => typeof r === "string" && r.trim().length > 0)
      .slice(0, MAX_REVIEWS)
      .map((r) => r.slice(0, MAX_CHARS_PER_REVIEW));

    if (sanitizedReviews.length === 0) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const prompt = `
You are given guest reviews for a rural homestay.
Return valid JSON only with keys: "summary", "positives", "negatives".
"summary" must be exactly two complete sentences, each ending with a period.
"positives" must include up to 3 concise positive themes.
"negatives" must include up to 3 concise negative themes.
No markdown. No commentary. No extra keys.

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
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const json = await geminiRes.json();

    const parts = json?.candidates?.[0]?.content?.parts;

    const raw = Array.isArray(parts)
      ? parts
          .map((p) => p.text)
          .join("")
          .trim()
      : null;

    if (!raw) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const parsed = parseModelPayload(raw);

    if (!parsed) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    return NextResponse.json(
      {
        summary: parsed.summary,
        positives: parsed.positives,
        negatives: parsed.negatives,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/ai/reviews-summary]", error);
    return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
  }
}
