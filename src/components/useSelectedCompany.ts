"use client";

import { useCallback, useEffect, useState } from "react";
import type { Company } from "@/lib/types";
import { fetchCompanies } from "@/lib/client";

const STORAGE_KEY = "stablepay.selectedCompanyId";

// Hook compartilhado: carrega as empresas e mantém a seleção atual
// (persistida no localStorage) sincronizada entre páginas/abas.
export function useSelectedCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedIdState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchCompanies();
      setCompanies(list);
      setSelectedIdState((current) => {
        const stored =
          current || localStorage.getItem(STORAGE_KEY) || list[0]?.id || "";
        const valid = list.some((c) => c.id === stored)
          ? stored
          : list[0]?.id || "";
        if (valid) localStorage.setItem(STORAGE_KEY, valid);
        return valid;
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar empresas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const setSelectedId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setSelectedIdState(id);
  }, []);

  const selected = companies.find((c) => c.id === selectedId);

  return {
    companies,
    selected,
    selectedId,
    setSelectedId,
    loading,
    error,
    reload,
  };
}
