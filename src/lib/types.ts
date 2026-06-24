// Domínio da plataforma de pagamentos USDT (modelo TCR).
// Tipos compartilhados entre API e UI.

export type Currency = "BRL" | "USDT" | "USDC";

export type KycStatus = "pending" | "approved" | "rejected";

export type TransactionType =
  | "conversion" // BRL <-> USDT/USDC dentro da plataforma
  | "remittance" // Remessa internacional (BRL -> USDT -> destino)
  | "merchant_receipt"; // Lojista recebe cripto e liquida em BRL

export type TransactionStatus = "pending" | "completed" | "failed";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  segment: string;
  kycStatus: KycStatus;
  createdAt: string;
}

export interface Wallet {
  companyId: string;
  currency: Currency;
  balance: number;
}

export interface Transaction {
  id: string;
  companyId: string;
  type: TransactionType;
  fromCurrency: Currency;
  toCurrency: Currency;
  amountFrom: number; // valor de entrada na moeda de origem
  amountTo: number; // valor creditado na moeda de destino
  rate: number; // taxa aplicada (BRL por USDT)
  spreadBps: number; // spread aplicado em basis points
  feeBrl: number; // taxa fixa cobrada (em BRL)
  status: TransactionStatus;
  reference?: string; // beneficiário / país / nota
  createdAt: string;
}

// Direção de uma cotação solicitada pelo cliente.
export type QuoteDirection = "BRL_TO_USDT" | "USDT_TO_BRL";

export interface Quote {
  direction: QuoteDirection;
  marketRate: number; // taxa de mercado (mid) BRL por USDT
  appliedRate: number; // taxa final aplicada ao cliente
  spreadBps: number;
  feeBrl: number;
  amountFrom: number;
  amountTo: number;
  // Quanto a plataforma ganha nesta operação (estimativa, em BRL).
  platformRevenueBrl: number;
  createdAt: string;
}
