import { NextResponse } from "next/server";
import { getCompany, getWallets } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json(
      { error: "Empresa não encontrada." },
      { status: 404 },
    );
  }
  const wallets = await getWallets(id);
  return NextResponse.json({ company, wallets });
}
