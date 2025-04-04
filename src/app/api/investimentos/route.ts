import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/investimentos
export async function GET() {
  try {
    const investimentos = await prisma.investimento.findMany({
      orderBy: {
        descricao: "asc",
      },
    });

    return NextResponse.json(investimentos);
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error);
    return NextResponse.json({ error: "Erro ao buscar investimentos" }, { status: 500 });
  }
}

// POST /api/investimentos
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { descricao, valor, quantidade, tipo, instituicao, data_compra } = body;

    if (!descricao || valor === undefined || quantidade === undefined || !tipo || !instituicao || !data_compra) {
      return NextResponse.json({ error: "Dados incompletos para criar investimento" }, { status: 400 });
    }

    // Validar tipo
    const tiposValidos = [
      "Ações",
      "Fundos Imobiliários",
      "Tesouro Direto",
      "CDB",
      "LCI/LCA",
      "Criptomoedas",
      "Fundos de Investimento",
      "Poupança",
      "Outros",
    ];

    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json({ error: "Tipo de investimento inválido" }, { status: 400 });
    }

    const investimento = await prisma.investimento.create({
      data: {
        descricao,
        valor: parseFloat(valor.toString()),
        quantidade: parseFloat(quantidade.toString()),
        tipo,
        instituicao,
        data_compra: new Date(data_compra),
      },
    });

    return NextResponse.json(investimento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar investimento:", error);
    return NextResponse.json({ error: "Erro ao criar investimento" }, { status: 500 });
  }
}
