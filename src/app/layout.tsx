import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "StablePay — Pagamentos globais com USDT",
  description:
    "Plataforma B2B de câmbio e pagamentos internacionais usando stablecoins (USDT/USDC) como trilho de liquidação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--muted)] flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {new Date().getFullYear()} StablePay (MVP demonstrativo)</span>
            <span>
              Protótipo de produto — não move valores reais e não substitui
              licenças regulatórias (BCB/COAF).
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
