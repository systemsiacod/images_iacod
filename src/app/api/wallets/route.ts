import { NextResponse } from "next/server";
import { getWallets } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json(
      { error: "Parâmetro companyId é obrigatório." },
      { status: 400 },
    );
  }
  const wallets = await getWallets(companyId);
  return NextResponse.json({ wallets });
}
