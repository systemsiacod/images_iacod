import type { Transaction } from "@/lib/types";
import { formatAmount, formatDateTime, formatRate } from "@/lib/format";
import { TxStatusBadge, TxTypeBadge } from "@/components/ui";

export function TransactionList({
  transactions,
  emptyHint,
}: {
  transactions: Transaction[];
  emptyHint?: string;
}) {
  if (transactions.length === 0) {
    return (
      <div className="card p-8 text-center text-[var(--muted)]">
        {emptyHint ?? "Nenhuma transação ainda."}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)] border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Destino</th>
              <th className="px-4 py-3 font-medium">Cotação</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-[var(--surface-2)]/40">
                <td className="px-4 py-3 whitespace-nowrap text-[var(--muted)]">
                  {formatDateTime(t.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <TxTypeBadge type={t.type} />
                  {t.reference && (
                    <div className="mt-1 text-xs text-[var(--muted)] max-w-[220px] truncate">
                      {t.reference}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono whitespace-nowrap text-[var(--danger)]">
                  − {formatAmount(t.amountFrom, t.fromCurrency)}
                </td>
                <td className="px-4 py-3 font-mono whitespace-nowrap text-[var(--brand)]">
                  + {formatAmount(t.amountTo, t.toCurrency)}
                </td>
                <td className="px-4 py-3 font-mono whitespace-nowrap">
                  R$ {formatRate(t.rate)}
                </td>
                <td className="px-4 py-3">
                  <TxStatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
