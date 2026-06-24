import Link from "next/link";
import { EconomyCalculator } from "@/components/EconomyCalculator";

const FEATURES = [
  {
    title: "Remessa internacional em minutos",
    body: "Converta BRL em dólar digital (USDT) e liquide pagamentos para o exterior em menos de 1 minuto, sem a lentidão do SWIFT.",
    icon: "🌎",
  },
  {
    title: "Câmbio com spread transparente",
    body: "Cotação de mercado em tempo real e spread claro. Sem IOF surpresa nem tarifas escondidas de banco.",
    icon: "📈",
  },
  {
    title: "Recebimento para lojistas",
    body: "Aceite pagamentos em cripto e receba em Reais no mesmo dia (D+0), direto na sua conta.",
    icon: "🛒",
  },
  {
    title: "Carteiras corporativas",
    body: "Saldos em BRL, USDT e USDC numa só conta, com histórico e conciliação para o seu financeiro.",
    icon: "👛",
  },
  {
    title: "API B2B",
    body: "Integre cotação, conversão e remessa ao seu ERP ou checkout com poucas linhas de código.",
    icon: "🔌",
  },
  {
    title: "Compliance by design",
    body: "KYC/KYB no onboarding e trilha de auditoria de cada operação, alinhado ao marco legal (Lei 14.478/2022).",
    icon: "🛡️",
  },
];

const STEPS = [
  ["Abra a conta corporativa", "Cadastro da empresa e KYC/KYB digital."],
  ["Deposite via PIX", "Seu saldo em BRL fica disponível na carteira."],
  ["Converta para USDT", "Cotação na hora, com spread transparente."],
  ["Envie ou receba", "Liquide pagamentos globais em minutos."],
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge text-[var(--brand)] border-[var(--brand)]/40">
            ● Fintech B2B de pagamentos com stablecoins
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
            Pagamentos globais na{" "}
            <span className="text-[var(--brand)]">velocidade do dólar digital</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            A StablePay conecta o sistema bancário (PIX/SWIFT) à blockchain,
            usando USDT e USDC como ponte para liquidar câmbio e remessas
            corporativas em minutos — com custo muito menor que o banco.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding" className="btn btn-primary">
              Abrir conta corporativa
            </Link>
            <Link href="/dashboard" className="btn btn-ghost">
              Ver o painel (demo)
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              ["< 1 min", "para liquidar"],
              ["1,5%", "spread típico"],
              ["24/7", "opera fim de semana"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="text-2xl font-bold text-[var(--brand)]">{k}</dt>
                <dd className="text-sm text-[var(--muted)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <EconomyCalculator />
      </section>

      {/* Como funciona */}
      <section className="py-12">
        <h2 className="text-2xl font-bold">Como funciona</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(([title, body], i) => (
            <div key={title} className="card p-5">
              <div className="text-[var(--brand)] font-bold text-sm">
                Passo {i + 1}
              </div>
              <div className="mt-1 font-semibold">{title}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section className="py-12">
        <h2 className="text-2xl font-bold">Tudo que sua empresa precisa</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-2 font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold">
            Pronto para reduzir o custo do seu câmbio?
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Crie sua conta corporativa de demonstração e teste a conversão
            BRL ↔ USDT agora mesmo.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/onboarding" className="btn btn-primary">
              Começar agora
            </Link>
            <Link href="/convert" className="btn btn-ghost">
              Simular uma conversão
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
