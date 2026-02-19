import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type PricingSuggestionRequest = {
  location: string;
  category: string;
  beds: number;
  maxGuests: number;
  amenities: string[];
  averageLocalPrice: number | null;
};

type PricingSuggestionResponse = {
  suggestedPrice: number | null;
  reasoning: string | null;
  reason?: "QUOTA_EXCEEDED";
};

const EMPTY_RESPONSE: PricingSuggestionResponse = {
  suggestedPrice: null,
  reasoning: null,
};

function extractJsonBlock(text: string): string | null {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return text.slice(first, last + 1);
  }
  return null;
}

function safeParsePricing(raw: string): PricingSuggestionResponse | null {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonBlock = extractJsonBlock(cleaned);

  if (jsonBlock) {
    try {
      const parsed = JSON.parse(jsonBlock) as {
        suggestedPrice?: unknown;
        reasoning?: unknown;
      };

      const price =
        typeof parsed.suggestedPrice === "number"
          ? parsed.suggestedPrice
          : typeof parsed.suggestedPrice === "string"
            ? Number(parsed.suggestedPrice)
            : null;

      if (price && Number.isFinite(price) && price > 0) {
        return {
          suggestedPrice: Math.round(price),
          reasoning:
            typeof parsed.reasoning === "string"
              ? parsed.reasoning.trim().slice(0, 300)
              : null,
        };
      }
    } catch {
      // fall through
    }
  }

  // 🔥 Fallback: extract price even if JSON truncated
  const priceMatch = cleaned.match(/"suggestedPrice"\s*:\s*(\d+)/);
  if (priceMatch) {
    return {
      suggestedPrice: Number(priceMatch[1]),
      reasoning: null,
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const body = (await req.json()) as Partial<PricingSuggestionRequest>;

    if (
      !body ||
      typeof body.location !== "string" ||
      typeof body.category !== "string" ||
      typeof body.beds !== "number" ||
      typeof body.maxGuests !== "number" ||
      !Array.isArray(body.amenities)
    ) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const location = body.location.trim().slice(0, 120);
    const category = body.category.trim().slice(0, 80);
    const beds = Math.max(0, Math.min(20, Math.floor(body.beds)));
    const maxGuests = Math.max(1, Math.min(30, Math.floor(body.maxGuests)));
    const amenities = body.amenities
      .filter((a): a is string => typeof a === "string")
      .map((a) => a.trim())
      .filter((a) => a.length > 0)
      .slice(0, 20);

    const averageLocalPrice =
      typeof body.averageLocalPrice === "number" &&
      Number.isFinite(body.averageLocalPrice) &&
      body.averageLocalPrice > 0
        ? Math.round(body.averageLocalPrice)
        : null;

    if (!location && !category) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const prompt = `
Return ONLY valid JSON.
Do not include explanation before or after.
No markdown.

JSON format:
{
  "suggestedPrice": number,
  "reasoning": string
}

Rules:
- Realistic rural INR pricing
- Consider amenities and capacity
- Keep reasoning under 2 short sentences

Location: ${location}
Category: ${category}
Beds: ${beds}
Max guests: ${maxGuests}
Amenities: ${amenities.join(", ") || "None"}
Average local price (INR): ${averageLocalPrice ?? "Unknown"}
`;

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 900,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();

      if (geminiRes.status === 429) {
        console.error("Gemini quota exceeded:", errorText);
        return NextResponse.json(
          { suggestedPrice: null, reasoning: null, reason: "QUOTA_EXCEEDED" },
          { status: 200 },
        );
      }

      console.error("Gemini error:", errorText);
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    const json = await geminiRes.json();
    const parts = json?.candidates?.[0]?.content?.parts;

    const raw = Array.isArray(parts)
      ? parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("")
      : "";

    if (!raw) {
      return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
    }

    console.log("RAW GEMINI PRICING RESPONSE:", raw);

    const parsed = safeParsePricing(raw);

    return NextResponse.json(parsed ?? EMPTY_RESPONSE, { status: 200 });
  } catch (error) {
    console.error("[POST /api/ai/pricing-suggestion]", error);
    return NextResponse.json(EMPTY_RESPONSE, { status: 200 });
  }
}
