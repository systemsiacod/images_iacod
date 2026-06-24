import { NextResponse } from "next/server";
import { buildQuote } from "@/lib/pricing";
import type { QuoteDirection } from "@/lib/types";

const DIRECTIONS: QuoteDirection[] = ["BRL_TO_USDT", "USDT_TO_BRL"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const direction = String(body.direction ?? "") as QuoteDirection;
  const amount = Number(body.amount);

  if (!DIRECTIONS.includes(direction)) {
    return NextResponse.json(
      { error: `direction deve ser um de: ${DIRECTIONS.join(", ")}.` },
      { status: 400 },
    );
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "amount deve ser um número positivo." },
      { status: 400 },
    );
  }

  const spreadBps =
    body.spreadBps !== undefined ? Number(body.spreadBps) : undefined;
  const feeBrl = body.feeBrl !== undefined ? Number(body.feeBrl) : undefined;

  const quote = buildQuote({ direction, amount, spreadBps, feeBrl });
  return NextResponse.json({ quote });
}
