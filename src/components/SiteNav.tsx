"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/dashboard", label: "Painel" },
  { href: "/convert", label: "Converter" },
  { href: "/transactions", label: "Transações" },
  { href: "/onboarding", label: "Abrir conta" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_85%,transparent)]">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span
            className="inline-grid place-items-center w-7 h-7 rounded-lg text-[#04130d]"
            style={{
              background: "linear-gradient(180deg,var(--brand),var(--brand-strong))",
            }}
          >
            ₮
          </span>
          <span>StablePay</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "bg-[var(--surface-2)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
