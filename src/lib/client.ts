// Helpers de fetch usados pelos componentes de cliente.

import type {
  Company,
  Quote,
  QuoteDirection,
  Transaction,
  TransactionType,
  Wallet,
} from "./types";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Erro inesperado.");
  }
  return data as T;
}

export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch("/api/companies", { cache: "no-store" });
  const data = await jsonOrThrow<{ companies: Company[] }>(res);
  return data.companies;
}

export async function fetchCompany(
  id: string,
): Promise<{ company: Company; wallets: Wallet[] }> {
  const res = await fetch(`/api/companies/${id}`, { cache: "no-store" });
  return jsonOrThrow(res);
}

export async function createCompany(input: {
  name: string;
  cnpj: string;
  email: string;
  segment: string;
}): Promise<Company> {
  const res = await fetch("/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await jsonOrThrow<{ company: Company }>(res);
  return data.company;
}

export async function setKyc(
  id: string,
  status: Company["kycStatus"],
): Promise<Company> {
  const res = await fetch(`/api/companies/${id}/kyc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await jsonOrThrow<{ company: Company }>(res);
  return data.company;
}

export async function fetchQuote(
  direction: QuoteDirection,
  amount: number,
): Promise<Quote> {
  const res = await fetch("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, amount }),
  });
  const data = await jsonOrThrow<{ quote: Quote }>(res);
  return data.quote;
}

export async function fetchTransactions(
  companyId?: string,
): Promise<Transaction[]> {
  const url = companyId
    ? `/api/transactions?companyId=${encodeURIComponent(companyId)}`
    : "/api/transactions";
  const res = await fetch(url, { cache: "no-store" });
  const data = await jsonOrThrow<{ transactions: Transaction[] }>(res);
  return data.transactions;
}

export async function createTransaction(input: {
  companyId: string;
  direction: QuoteDirection;
  amount: number;
  type: TransactionType;
  reference?: string;
}): Promise<{ transaction: Transaction; wallets: Wallet[]; quote: Quote }> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow(res);
}

export async function deposit(
  companyId: string,
  currency: Wallet["currency"],
  amount: number,
): Promise<Wallet[]> {
  const res = await fetch("/api/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, currency, amount }),
  });
  const data = await jsonOrThrow<{ wallets: Wallet[] }>(res);
  return data.wallets;
}
