import { NextResponse } from "next/server";
import { updateKyc } from "@/lib/store";
import type { KycStatus } from "@/lib/types";

const VALID: KycStatus[] = ["pending", "approved", "rejected"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const status = String(body.status ?? "") as KycStatus;
  if (!VALID.includes(status)) {
    return NextResponse.json(
      { error: `status deve ser um de: ${VALID.join(", ")}.` },
      { status: 400 },
    );
  }

  const company = await updateKyc(id, status);
  if (!company) {
    return NextResponse.json(
      { error: "Empresa não encontrada." },
      { status: 404 },
    );
  }
  return NextResponse.json({ company });
}
