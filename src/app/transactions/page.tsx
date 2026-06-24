"use client";

import { useEffect, useState } from "react";
import { useSelectedCompany } from "@/components/useSelectedCompany";
import { CompanySelector } from "@/components/CompanySelector";
import { TransactionList } from "@/components/TransactionList";
import { PageHeader } from "@/components/ui";
import { fetchTransactions } from "@/lib/client";
import { formatBRL } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const { companies, selected, selectedId, setSelectedId } =
    useSelectedCompany();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allCompanies, setAllCompanies] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const companyId = allCompanies ? undefined : selectedId;
    if (!allCompanies && !companyId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    fetchTransactions(companyId)
      .then((txs) => active && setTransactions(txs))
      .catch(() => active && setTransactions([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [selectedId, allCompanies]);

  // Receita estimada da plataforma: spread sobre o nocional + taxas fixas.
  const revenue = transactions.reduce((sum, t) => {
    const notionalUsdt =
      t.fromCurrency === "USDT" ? t.amountFrom : t.amountTo;
    const spreadBrl = notionalUsdt * t.rate * (t.spreadBps / 10_000);
    return sum + spreadBrl + t.feeBrl;
  }, 0);

  const volumeBrl = transactions.reduce((sum, t) => {
    const brl =
      t.fromCurrency === "BRL"
        ? t.amountFrom
        : t.toCurrency === "BRL"
          ? t.amountTo
          : t.amountFrom * t.rate;
    return sum + brl;
  }, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Transações"
        subtitle="Histórico completo e métricas de receita da plataforma."
      />

      <div className="card p-5">
        <CompanySelector
          companies={companies}
          selectedId={selectedId}
          onChange={setSelectedId}
          selected={selected}
        />
        <label className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={allCompanies}
            onChange={(e) => setAllCompanies(e.target.checked)}
          />
          Ver todas as empresas (visão operadora)
        </label>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Metric label="Transações" value={String(transactions.length)} />
        <Metric label="Volume movimentado" value={formatBRL(volumeBrl)} />
        <Metric
          label="Receita da plataforma (est.)"
          value={formatBRL(revenue)}
          brand
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="card p-8 text-center text-[var(--muted)]">
            Carregando…
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  brand,
}: {
  label: string;
  value: string;
  brand?: boolean;
}) {
  return (
    <div className="card p-5">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div
        className={`mt-1 text-2xl font-bold ${
          brand ? "text-[var(--brand)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
