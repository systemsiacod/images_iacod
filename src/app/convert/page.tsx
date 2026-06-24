"use client";

import { useEffect, useState } from "react";
import { useSelectedCompany } from "@/components/useSelectedCompany";
import { CompanySelector } from "@/components/CompanySelector";
import { PageHeader } from "@/components/ui";
import { createTransaction, fetchQuote } from "@/lib/client";
import {
  bpsToPercent,
  formatAmount,
  formatBRL,
  formatRate,
} from "@/lib/format";
import type {
  Currency,
  Quote,
  QuoteDirection,
  TransactionType,
} from "@/lib/types";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "conversion", label: "Conversão interna" },
  { value: "remittance", label: "Remessa internacional" },
  { value: "merchant_receipt", label: "Recebimento de lojista" },
];

export default function ConvertPage() {
  const { companies, selected, selectedId, setSelectedId } =
    useSelectedCompany();
  const [direction, setDirection] = useState<QuoteDirection>("BRL_TO_USDT");
  const [type, setType] = useState<TransactionType>("conversion");
  const [amount, setAmount] = useState(10000);
  const [reference, setReference] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fromCurrency: Currency = direction === "BRL_TO_USDT" ? "BRL" : "USDT";
  const toCurrency: Currency = direction === "BRL_TO_USDT" ? "USDT" : "BRL";

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!amount || amount <= 0) {
        setQuote(null);
        return;
      }
      try {
        setQuote(await fetchQuote(direction, amount));
      } catch {
        setQuote(null);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [direction, amount]);

  async function handleExecute() {
    if (!selectedId || !quote) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await createTransaction({
        companyId: selectedId,
        direction,
        amount,
        type,
        reference: reference.trim() || undefined,
      });
      setResult(
        `Operação concluída: você ${
          direction === "BRL_TO_USDT" ? "recebeu" : "recebeu"
        } ${formatAmount(res.transaction.amountTo, toCurrency)}.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao executar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Converter / Enviar"
        subtitle="Cotação em tempo real com spread transparente. BRL ↔ USDT."
      />

      <div className="card p-5">
        <CompanySelector
          companies={companies}
          selectedId={selectedId}
          onChange={setSelectedId}
          selected={selected}
        />
      </div>

      <div className="card p-5 mt-4">
        {/* Direção */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          {(["BRL_TO_USDT", "USDT_TO_BRL"] as QuoteDirection[]).map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                direction === d
                  ? "bg-[var(--surface-2)] text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {d === "BRL_TO_USDT" ? "BRL → USDT" : "USDT → BRL"}
            </button>
          ))}
        </div>

        {/* Tipo */}
        <label className="block mt-4 text-sm text-[var(--muted)]">
          Tipo de operação
        </label>
        <select
          className="select mt-1"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Valor */}
        <label className="block mt-4 text-sm text-[var(--muted)]">
          Valor a enviar ({fromCurrency})
        </label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input mt-1 font-mono text-lg"
        />

        {/* Referência */}
        <label className="block mt-4 text-sm text-[var(--muted)]">
          Referência / beneficiário (opcional)
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ex.: Pagamento fornecedor — Miami, EUA"
          className="input mt-1"
        />

        {/* Cotação */}
        <div className="mt-5 rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          <QuoteRow
            label="Cotação de mercado"
            value={quote ? `R$ ${formatRate(quote.marketRate)}` : "—"}
            muted
          />
          <QuoteRow
            label={`Cotação aplicada (spread ${
              quote ? bpsToPercent(quote.spreadBps) : "—"
            })`}
            value={quote ? `R$ ${formatRate(quote.appliedRate)}` : "—"}
          />
          <QuoteRow
            label="Taxa fixa"
            value={quote ? formatBRL(quote.feeBrl) : "—"}
            muted
          />
          <QuoteRow
            label="Você recebe"
            value={quote ? formatAmount(quote.amountTo, toCurrency) : "—"}
            strong
          />
        </div>

        {error && (
          <div className="mt-4 card p-3 text-sm border-[var(--danger)]/50 text-[var(--danger)]">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 card p-3 text-sm border-[var(--brand)]/50 text-[var(--brand)]">
            {result}
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={busy || !quote || !selectedId}
          className="btn btn-primary w-full mt-5"
        >
          {busy ? "Processando…" : "Confirmar operação"}
        </button>
        <p className="mt-2 text-xs text-[var(--muted)] text-center">
          Operação simulada: debita {fromCurrency} e credita {toCurrency} na
          carteira da empresa selecionada.
        </p>
      </div>
    </div>
  );
}

function QuoteRow({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className={muted ? "text-[var(--muted)]" : ""}>{label}</span>
      <span
        className={`font-mono ${
          strong ? "font-bold text-[var(--brand)] text-base" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
