"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/types";
import { formatBRL, formatCrypto, formatRate } from "@/lib/format";

// Premissas de custo de um câmbio bancário tradicional, para comparação.
const BANK_SPREAD = 0.045; // ~4,5% de spread
const BANK_IOF = 0.0038; // IOF câmbio
const BANK_FIXED_FEE = 80; // tarifa fixa estimada (R$)

export function EconomyCalculator() {
  const [amount, setAmount] = useState(50000);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!amount || amount <= 0) {
        setQuote(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction: "BRL_TO_USDT", amount }),
        });
        const data = await res.json();
        setQuote(data.quote ?? null);
      } catch {
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [amount]);

  // Custo do banco tradicional sobre o mesmo valor.
  const bankCost = amount * (BANK_SPREAD + BANK_IOF) + BANK_FIXED_FEE;
  const stablepayCost = quote
    ? amount - quote.amountTo * quote.marketRate
    : 0;
  const economy = Math.max(0, bankCost - stablepayCost);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Calculadora de economia</h3>
        <span className="badge text-[var(--brand)] border-[var(--brand)]/40">
          BRL → USDT
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Quanto você economiza vs. o câmbio de um banco tradicional.
      </p>

      <label className="block mt-4 text-sm text-[var(--muted)]">
        Valor a enviar (BRL)
      </label>
      <input
        type="number"
        min={0}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="input mt-1 font-mono"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          label="Você recebe"
          value={
            quote ? formatCrypto(quote.amountTo, "USDT") : loading ? "…" : "—"
          }
          highlight
        />
        <Stat
          label="Cotação aplicada"
          value={quote ? `R$ ${formatRate(quote.appliedRate)}` : "—"}
        />
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        <Row label="Custo na StablePay" value={formatBRL(stablepayCost)} />
        <Row label="Custo estimado no banco" value={formatBRL(bankCost)} muted />
        <Row
          label="Sua economia"
          value={formatBRL(economy)}
          strongBrand
        />
      </div>

      <p className="mt-3 text-xs text-[var(--muted)]">
        Estimativa para fins de demonstração. Premissas do banco: spread 4,5% +
        IOF 0,38% + tarifa fixa.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[var(--surface-2)] p-3">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div
        className={`mt-0.5 font-mono font-semibold ${
          highlight ? "text-[var(--brand)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strongBrand,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strongBrand?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <span className={muted ? "text-[var(--muted)]" : ""}>{label}</span>
      <span
        className={`font-mono font-semibold ${
          strongBrand ? "text-[var(--brand)]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
