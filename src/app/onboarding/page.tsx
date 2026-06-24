"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { createCompany } from "@/lib/client";

const SEGMENTS = [
  "Importação de tecnologia",
  "Exportação de commodities",
  "Agronegócio",
  "Varejo / lojista",
  "Prestação de serviços ao exterior",
  "Marketplace",
  "Outro",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    email: "",
    segment: SEGMENTS[0],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const company = await createCompany(form);
      localStorage.setItem("stablepay.selectedCompanyId", company.id);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <PageHeader
        title="Abrir conta corporativa"
        subtitle="Cadastro da empresa para KYC/KYB. Em produção, validaríamos os documentos e o quadro societário."
      />

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <Field label="Razão social">
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Minha Empresa LTDA"
          />
        </Field>
        <Field label="CNPJ">
          <input
            required
            className="input font-mono"
            value={form.cnpj}
            onChange={(e) => update("cnpj", e.target.value)}
            placeholder="00.000.000/0001-00"
          />
        </Field>
        <Field label="E-mail financeiro">
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="financeiro@empresa.com.br"
          />
        </Field>
        <Field label="Segmento">
          <select
            className="select"
            value={form.segment}
            onChange={(e) => update("segment", e.target.value)}
          >
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <div className="card p-3 text-sm border-[var(--danger)]/50 text-[var(--danger)]">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Criando conta…" : "Criar conta e ir para o painel"}
        </button>
        <p className="text-xs text-[var(--muted)] text-center">
          A conta é criada com KYC pendente. No painel você poderá aprovar o
          KYC (demo) para liberar as operações.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
