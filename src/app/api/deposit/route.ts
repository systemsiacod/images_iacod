import { NextResponse } from "next/server";
import { deposit } from "@/lib/store";
import type { Currency } from "@/lib/types";

const CURRENCIES: Currency[] = ["BRL", "USDT", "USDC"];

// Simula um on-ramp (depósito via PIX ou recebimento de cripto) para testes.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const companyId = String(body.companyId ?? "").trim();
  const currency = String(body.currency ?? "") as Currency;
  const amount = Number(body.amount);

  if (!companyId || !CURRENCIES.includes(currency)) {
    return NextResponse.json(
      { error: "companyId e currency (BRL|USDT|USDC) são obrigatórios." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "amount deve ser positivo." },
      { status: 400 },
    );
  }

  const result = await deposit(companyId, currency, amount);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }
  return NextResponse.json({ wallets: result.wallets });
}
