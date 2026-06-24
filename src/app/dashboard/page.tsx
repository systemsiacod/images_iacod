"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelectedCompany } from "@/components/useSelectedCompany";
import { CompanySelector } from "@/components/CompanySelector";
import { TransactionList } from "@/components/TransactionList";
import { KycBadge, PageHeader } from "@/components/ui";
import {
  deposit as apiDeposit,
  fetchCompany,
  fetchQuote,
  fetchTransactions,
  setKyc,
} from "@/lib/client";
import { formatBRL, formatCrypto } from "@/lib/format";
import type { Currency, Transaction, Wallet } from "@/lib/types";

export default function DashboardPage() {
  const { companies, selected, selectedId, setSelectedId, loading, reload } =
    useSelectedCompany();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketRate, setMarketRate] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = useCallback(async (companyId: string) => {
    if (!companyId) return;
    const [detail, txs, quote] = await Promise.all([
      fetchCompany(companyId),
      fetchTransactions(companyId),
      fetchQuote("BRL_TO_USDT", 1),
    ]);
    setWallets(detail.wallets);
    setTransactions(txs);
    setMarketRate(quote.marketRate);
  }, []);

  useEffect(() => {
    if (selectedId) loadData(selectedId).catch(() => {});
  }, [selectedId, loadData]);

  const totalBrl =
    marketRate != null
      ? wallets.reduce(
          (sum, w) =>
            sum + (w.currency === "BRL" ? w.balance : w.balance * marketRate),
          0,
        )
      : null;

  async function handleApproveKyc() {
    if (!selected) return;
    setBusy(true);
    setMsg(null);
    try {
      await setKyc(selected.id, "approved");
      await reload();
      await loadData(selected.id);
      setMsg("KYC aprovado. A empresa já pode operar.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeposit(currency: Currency) {
    if (!selectedId) return;
    const raw = window.prompt(`Valor a depositar em ${currency} (on-ramp simulado):`);
    if (!raw) return;
    const amount = Number(raw.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setMsg("Valor inválido.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const updated = await apiDeposit(selectedId, currency, amount);
      setWallets(updated);
      setMsg(`Depósito de ${currency} efetuado.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Painel da empresa"
        subtitle="Saldos, conta e atividade recente da sua conta corporativa."
      />

      <div className="card p-5">
        {loading ? (
          <p className="text-[var(--muted)]">Carregando empresas…</p>
        ) : companies.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[var(--muted)]">Nenhuma empresa cadastrada.</p>
            <Link href="/onboarding" className="btn btn-primary mt-3">
              Abrir conta corporativa
            </Link>
          </div>
        ) : (
          <CompanySelector
            companies={companies}
            selectedId={selectedId}
            onChange={setSelectedId}
            selected={selected}
          />
        )}
      </div>

      {msg && (
        <div className="mt-4 card p-3 text-sm border-[var(--brand)]/40 text-[var(--brand)]">
          {msg}
        </div>
      )}

      {selected && (
        <>
          {selected.kycStatus !== "approved" && (
            <div className="mt-4 card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-[var(--warning)]/40">
              <div className="flex items-center gap-3">
                <KycBadge status={selected.kycStatus} />
                <span className="text-sm text-[var(--muted)]">
                  É necessário aprovar o KYC/KYB para liberar operações.
                </span>
              </div>
              <button
                onClick={handleApproveKyc}
                disabled={busy}
                className="btn btn-primary"
              >
                Aprovar KYC (demo)
              </button>
            </div>
          )}

          {/* Saldo total estimado */}
          <div className="mt-6 grid lg:grid-cols-4 gap-4">
            <div className="card p-5 lg:col-span-1">
              <div className="text-sm text-[var(--muted)]">
                Patrimônio estimado
              </div>
              <div className="mt-1 text-2xl font-bold text-[var(--brand)]">
                {totalBrl != null ? formatBRL(totalBrl) : "…"}
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">
                Convertido pela cotação de mercado
                {marketRate ? ` (R$ ${marketRate.toFixed(4)}/USDT)` : ""}
              </div>
            </div>

            {wallets.map((w) => (
              <div key={w.currency} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Carteira {w.currency}
                  </span>
                  <button
                    onClick={() => handleDeposit(w.currency)}
                    disabled={busy}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    + Depositar
                  </button>
                </div>
                <div className="mt-1 text-xl font-bold font-mono">
                  {w.currency === "BRL"
                    ? formatBRL(w.balance)
                    : formatCrypto(w.balance, w.currency)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Transações recentes</h2>
            <div className="flex gap-2">
              <Link href="/convert" className="btn btn-primary">
                Nova conversão
              </Link>
              <Link href="/transactions" className="btn btn-ghost">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="mt-3">
            <TransactionList
              transactions={transactions.slice(0, 5)}
              emptyHint="Sem transações ainda. Faça sua primeira conversão."
            />
          </div>
        </>
      )}
    </div>
  );
}
