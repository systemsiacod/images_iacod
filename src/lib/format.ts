// Formatadores compartilhados (cliente e servidor).

import type { Currency } from "./types";

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCrypto(value: number, currency: Currency): string {
  const v = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
  return `${v} ${currency}`;
}

export function formatAmount(value: number, currency: Currency): string {
  return currency === "BRL" ? formatBRL(value) : formatCrypto(value, currency);
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(rate);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })}%`;
}
