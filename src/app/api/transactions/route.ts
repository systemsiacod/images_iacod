import { NextResponse } from "next/server";
import { buildQuote } from "@/lib/pricing";
import { executeTransaction, listTransactions } from "@/lib/store";
import type {
  Currency,
  QuoteDirection,
  TransactionType,
} from "@/lib/types";

const DIRECTIONS: QuoteDirection[] = ["BRL_TO_USDT", "USDT_TO_BRL"];
const TYPES: TransactionType[] = [
  "conversion",
  "remittance",
  "merchant_receipt",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId") ?? undefined;
  const transactions = await listTransactions(companyId);
  return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const companyId = String(body.companyId ?? "").trim();
  const direction = String(body.direction ?? "") as QuoteDirection;
  const amount = Number(body.amount);
  const type = (String(body.type ?? "conversion") as TransactionType) || "conversion";
  const reference = body.reference ? String(body.reference) : undefined;

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId é obrigatório." },
      { status: 400 },
    );
  }
  if (!DIRECTIONS.includes(direction)) {
    return NextResponse.json(
      { error: `direction deve ser um de: ${DIRECTIONS.join(", ")}.` },
      { status: 400 },
    );
  }
  if (!TYPES.includes(type)) {
    return NextResponse.json(
      { error: `type deve ser um de: ${TYPES.join(", ")}.` },
      { status: 400 },
    );
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "amount deve ser um número positivo." },
      { status: 400 },
    );
  }

  const quote = buildQuote({ direction, amount });
  const fromCurrency: Currency =
    direction === "BRL_TO_USDT" ? "BRL" : "USDT";
  const toCurrency: Currency = direction === "BRL_TO_USDT" ? "USDT" : "BRL";

  const result = await executeTransaction({
    companyId,
    type,
    fromCurrency,
    toCurrency,
    amountFrom: quote.amountFrom,
    amountTo: quote.amountTo,
    rate: quote.appliedRate,
    spreadBps: quote.spreadBps,
    feeBrl: quote.feeBrl,
    reference,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json(
    { transaction: result.transaction, wallets: result.wallets, quote },
    { status: 201 },
  );
}
