// Camada de dados do MVP.
//
// Para o MVP usamos um store em memória (singleton via globalThis para
// sobreviver ao hot-reload do Next) com persistência best-effort em
// `data/db.json`. Em produção, troque por Postgres/Supabase mantendo a
// mesma interface de funções.

import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Company,
  Transaction,
  Wallet,
} from "./types";

interface DB {
  companies: Company[];
  wallets: Wallet[];
  transactions: Transaction[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const globalForStore = globalThis as unknown as { __usdtDB?: DB };

function seed(): DB {
  const now = Date.now();
  const iso = (offsetMin: number) =>
    new Date(now - offsetMin * 60_000).toISOString();

  const companies: Company[] = [
    {
      id: "cmp_techimport",
      name: "TechImport Eletrônicos LTDA",
      cnpj: "12.345.678/0001-90",
      email: "financeiro@techimport.com.br",
      segment: "Importação de tecnologia",
      kycStatus: "approved",
      createdAt: iso(60 * 24 * 40),
    },
    {
      id: "cmp_agroexport",
      name: "AgroExport Commodities S/A",
      cnpj: "98.765.432/0001-10",
      email: "tesouraria@agroexport.com",
      segment: "Exportação de commodities",
      kycStatus: "approved",
      createdAt: iso(60 * 24 * 25),
    },
    {
      id: "cmp_novaloja",
      name: "Nova Loja Comércio Digital ME",
      cnpj: "45.111.222/0001-33",
      email: "contato@novaloja.com.br",
      segment: "Varejo / lojista",
      kycStatus: "pending",
      createdAt: iso(60 * 24 * 3),
    },
  ];

  const wallets: Wallet[] = [
    { companyId: "cmp_techimport", currency: "BRL", balance: 184_500.55 },
    { companyId: "cmp_techimport", currency: "USDT", balance: 12_300.0 },
    { companyId: "cmp_techimport", currency: "USDC", balance: 0 },
    { companyId: "cmp_agroexport", currency: "BRL", balance: 92_010.0 },
    { companyId: "cmp_agroexport", currency: "USDT", balance: 58_900.0 },
    { companyId: "cmp_agroexport", currency: "USDC", balance: 5_000.0 },
    { companyId: "cmp_novaloja", currency: "BRL", balance: 7_800.0 },
    { companyId: "cmp_novaloja", currency: "USDT", balance: 0 },
    { companyId: "cmp_novaloja", currency: "USDC", balance: 0 },
  ];

  const transactions: Transaction[] = [
    {
      id: "tx_0001",
      companyId: "cmp_techimport",
      type: "remittance",
      fromCurrency: "BRL",
      toCurrency: "USDT",
      amountFrom: 100_000,
      amountTo: 16_750.42,
      rate: 5.94,
      spreadBps: 150,
      feeBrl: 9.9,
      status: "completed",
      reference: "Pagamento fornecedor — Shenzhen, China",
      createdAt: iso(60 * 24 * 5),
    },
    {
      id: "tx_0002",
      companyId: "cmp_agroexport",
      type: "conversion",
      fromCurrency: "USDT",
      toCurrency: "BRL",
      amountFrom: 20_000,
      amountTo: 115_180.0,
      rate: 5.76,
      spreadBps: 150,
      feeBrl: 9.9,
      status: "completed",
      reference: "Liquidação de recebível de exportação",
      createdAt: iso(60 * 24 * 2),
    },
  ];

  return { companies, wallets, transactions };
}

async function load(): Promise<DB> {
  if (globalForStore.__usdtDB) return globalForStore.__usdtDB;
  let db: DB;
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    db = JSON.parse(raw) as DB;
  } catch {
    db = seed();
    await persist(db);
  }
  globalForStore.__usdtDB = db;
  return db;
}

async function persist(db: DB): Promise<void> {
  // Best-effort: em ambientes com filesystem somente-leitura apenas ignora.
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch {
    /* noop */
  }
}

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- Companies ----------

export async function listCompanies(): Promise<Company[]> {
  const db = await load();
  return db.companies;
}

export async function getCompany(id: string): Promise<Company | undefined> {
  const db = await load();
  return db.companies.find((c) => c.id === id);
}

export async function createCompany(
  input: Pick<Company, "name" | "cnpj" | "email" | "segment">,
): Promise<Company> {
  const db = await load();
  const company: Company = {
    id: genId("cmp"),
    name: input.name,
    cnpj: input.cnpj,
    email: input.email,
    segment: input.segment,
    kycStatus: "pending",
    createdAt: new Date().toISOString(),
  };
  db.companies.push(company);
  for (const currency of ["BRL", "USDT", "USDC"] as const) {
    db.wallets.push({ companyId: company.id, currency, balance: 0 });
  }
  await persist(db);
  return company;
}

export async function updateKyc(
  companyId: string,
  status: Company["kycStatus"],
): Promise<Company | undefined> {
  const db = await load();
  const company = db.companies.find((c) => c.id === companyId);
  if (!company) return undefined;
  company.kycStatus = status;
  await persist(db);
  return company;
}

// ---------- Wallets ----------

export async function getWallets(companyId: string): Promise<Wallet[]> {
  const db = await load();
  return db.wallets.filter((w) => w.companyId === companyId);
}

async function adjustWallet(
  db: DB,
  companyId: string,
  currency: Wallet["currency"],
  delta: number,
): Promise<Wallet> {
  let wallet = db.wallets.find(
    (w) => w.companyId === companyId && w.currency === currency,
  );
  if (!wallet) {
    wallet = { companyId, currency, balance: 0 };
    db.wallets.push(wallet);
  }
  wallet.balance = Math.round((wallet.balance + delta) * 1e6) / 1e6;
  return wallet;
}

// ---------- Transactions ----------

export async function listTransactions(
  companyId?: string,
): Promise<Transaction[]> {
  const db = await load();
  const txs = companyId
    ? db.transactions.filter((t) => t.companyId === companyId)
    : db.transactions;
  return [...txs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface NewTransactionInput {
  companyId: string;
  type: Transaction["type"];
  fromCurrency: Transaction["fromCurrency"];
  toCurrency: Transaction["toCurrency"];
  amountFrom: number;
  amountTo: number;
  rate: number;
  spreadBps: number;
  feeBrl: number;
  reference?: string;
}

export interface ExecutionResult {
  ok: boolean;
  error?: string;
  transaction?: Transaction;
  wallets?: Wallet[];
}

export async function executeTransaction(
  input: NewTransactionInput,
): Promise<ExecutionResult> {
  const db = await load();
  const company = db.companies.find((c) => c.id === input.companyId);
  if (!company) return { ok: false, error: "Empresa não encontrada." };
  if (company.kycStatus !== "approved") {
    return {
      ok: false,
      error: "KYC pendente: aprove o cadastro antes de operar.",
    };
  }

  const source = db.wallets.find(
    (w) =>
      w.companyId === input.companyId && w.currency === input.fromCurrency,
  );
  const available = source?.balance ?? 0;
  if (available + 1e-9 < input.amountFrom) {
    return {
      ok: false,
      error: `Saldo insuficiente em ${input.fromCurrency}. Disponível: ${available}.`,
    };
  }

  await adjustWallet(db, input.companyId, input.fromCurrency, -input.amountFrom);
  await adjustWallet(db, input.companyId, input.toCurrency, input.amountTo);

  const transaction: Transaction = {
    id: genId("tx"),
    companyId: input.companyId,
    type: input.type,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    amountFrom: input.amountFrom,
    amountTo: input.amountTo,
    rate: input.rate,
    spreadBps: input.spreadBps,
    feeBrl: input.feeBrl,
    status: "completed",
    reference: input.reference,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(transaction);
  await persist(db);

  const wallets = db.wallets.filter((w) => w.companyId === input.companyId);
  return { ok: true, transaction, wallets };
}

// Deposita saldo (simula on-ramp via PIX / depósito de cripto) para testes.
export async function deposit(
  companyId: string,
  currency: Wallet["currency"],
  amount: number,
): Promise<ExecutionResult> {
  const db = await load();
  const company = db.companies.find((c) => c.id === companyId);
  if (!company) return { ok: false, error: "Empresa não encontrada." };
  if (amount <= 0) return { ok: false, error: "Valor inválido." };
  await adjustWallet(db, companyId, currency, amount);
  await persist(db);
  return { ok: true, wallets: db.wallets.filter((w) => w.companyId === companyId) };
}
