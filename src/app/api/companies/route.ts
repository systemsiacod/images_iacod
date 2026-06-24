import { NextResponse } from "next/server";
import { createCompany, listCompanies } from "@/lib/store";

export async function GET() {
  const companies = await listCompanies();
  return NextResponse.json({ companies });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const cnpj = String(body.cnpj ?? "").trim();
  const email = String(body.email ?? "").trim();
  const segment = String(body.segment ?? "").trim() || "Não informado";

  if (!name || !cnpj || !email) {
    return NextResponse.json(
      { error: "Campos obrigatórios: name, cnpj, email." },
      { status: 400 },
    );
  }

  const company = await createCompany({ name, cnpj, email, segment });
  return NextResponse.json({ company }, { status: 201 });
}
