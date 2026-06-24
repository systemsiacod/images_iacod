// Motor de cotação e spread BRL <-> USDT.
//
// Em produção, a `marketRate` viria de uma exchange/provedor de liquidez
// (ex.: feed de preço USDT/BRL). Aqui simulamos um preço de mercado com
// pequena variação determinística para a UI parecer "viva", sem aleatoriedade
// que quebre testes/builds.

import type { Quote, QuoteDirection } from "./types";

// Parâmetros comerciais padrão da plataforma.
export const PRICING_CONFIG = {
  // Spread cobrado sobre a taxa de mercado, em basis points (150 = 1,5%).
  defaultSpreadBps: 150,
  // Taxa fixa por operação, em BRL.
  defaultFeeBrl: 9.9,
  // Preço base de referência: BRL por 1 USDT.
  baseUsdtBrl: 5.85,
};

const BPS = 10_000;

// Preço de mercado simulado: oscila suavemente ao longo do dia (+/- ~0,5%).
export function getMarketRate(now: Date = new Date()): number {
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  // onda senoidal determinística no intervalo [-1, 1]
  const wave = Math.sin((minutes / 1440) * Math.PI * 2);
  const rate = PRICING_CONFIG.baseUsdtBrl * (1 + wave * 0.005);
  return round(rate, 4);
}

export interface QuoteParams {
  direction: QuoteDirection;
  amount: number; // valor na moeda de origem da direção
  spreadBps?: number;
  feeBrl?: number;
  now?: Date;
}

export function buildQuote(params: QuoteParams): Quote {
  const spreadBps = params.spreadBps ?? PRICING_CONFIG.defaultSpreadBps;
  const feeBrl = params.feeBrl ?? PRICING_CONFIG.defaultFeeBrl;
  const marketRate = getMarketRate(params.now);
  const amountFrom = Math.max(0, params.amount || 0);

  let appliedRate: number;
  let amountTo: number;
  let platformRevenueBrl: number;

  if (params.direction === "BRL_TO_USDT") {
    // Cliente entrega BRL e recebe USDT. Vendemos USDT mais caro (rate maior).
    appliedRate = round(marketRate * (1 + spreadBps / BPS), 4);
    const brlForCrypto = Math.max(0, amountFrom - feeBrl);
    amountTo = round(brlForCrypto / appliedRate, 6); // USDT
    // Receita = diferença de spread sobre o nocional + taxa fixa.
    const notionalUsdt = brlForCrypto / marketRate;
    platformRevenueBrl = round(
      notionalUsdt * (appliedRate - marketRate) + feeBrl,
      2,
    );
  } else {
    // Cliente entrega USDT e recebe BRL. Compramos USDT mais barato (rate menor).
    appliedRate = round(marketRate * (1 - spreadBps / BPS), 4);
    const grossBrl = amountFrom * appliedRate; // amountFrom em USDT
    amountTo = round(Math.max(0, grossBrl - feeBrl), 2); // BRL
    platformRevenueBrl = round(
      amountFrom * (marketRate - appliedRate) + feeBrl,
      2,
    );
  }

  return {
    direction: params.direction,
    marketRate,
    appliedRate,
    spreadBps,
    feeBrl,
    amountFrom: round(amountFrom, 6),
    amountTo,
    platformRevenueBrl,
    createdAt: (params.now ?? new Date()).toISOString(),
  };
}

export function round(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * f) / f;
}
