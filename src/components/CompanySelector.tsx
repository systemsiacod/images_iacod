"use client";

import type { Company } from "@/lib/types";
import { KycBadge } from "@/components/ui";

export function CompanySelector({
  companies,
  selectedId,
  onChange,
  selected,
}: {
  companies: Company[];
  selectedId: string;
  onChange: (id: string) => void;
  selected?: Company;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <label className="text-xs text-[var(--muted)]">Empresa ativa</label>
        <select
          className="select mt-1"
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <div className="sm:pt-5">
          <KycBadge status={selected.kycStatus} />
        </div>
      )}
    </div>
  );
}
