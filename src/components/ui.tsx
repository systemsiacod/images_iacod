import type {
  KycStatus,
  TransactionStatus,
  TransactionType,
} from "@/lib/types";

const KYC_MAP: Record<KycStatus, { label: string; color: string }> = {
  approved: { label: "KYC aprovado", color: "var(--brand)" },
  pending: { label: "KYC pendente", color: "var(--warning)" },
  rejected: { label: "KYC rejeitado", color: "var(--danger)" },
};

export function KycBadge({ status }: { status: KycStatus }) {
  const { label, color } = KYC_MAP[status];
  return (
    <span className="badge" style={{ color, borderColor: color }}>
      ● {label}
    </span>
  );
}

const TX_TYPE_LABEL: Record<TransactionType, string> = {
  conversion: "Conversão",
  remittance: "Remessa",
  merchant_receipt: "Recebimento",
};

export function TxTypeBadge({ type }: { type: TransactionType }) {
  return <span className="badge text-[var(--muted)]">{TX_TYPE_LABEL[type]}</span>;
}

const TX_STATUS: Record<TransactionStatus, { label: string; color: string }> = {
  completed: { label: "Concluída", color: "var(--brand)" },
  pending: { label: "Pendente", color: "var(--warning)" },
  failed: { label: "Falhou", color: "var(--danger)" },
};

export function TxStatusBadge({ status }: { status: TransactionStatus }) {
  const { label, color } = TX_STATUS[status];
  return (
    <span className="badge" style={{ color, borderColor: color }}>
      {label}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}
