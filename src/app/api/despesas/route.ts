import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/despesas
export async function GET() {
  try {
    const despesas = await prisma.despesa.findMany({
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json(despesas);
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return NextResponse.json({ error: "Erro ao buscar despesas" }, { status: 500 });
  }
}

// POST /api/despesas
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { descricao, data, valor, categoria, observacao, forma_pagamento } = body;

    if (!descricao || !data || !valor || !categoria || !forma_pagamento) {
      return NextResponse.json({ error: "Dados incompletos para criar despesa" }, { status: 400 });
    }

    const despesa = await prisma.despesa.create({
      data: {
        descricao,
        data: new Date(data),
        valor: parseFloat(valor),
        categoria,
        observacao: observacao || null,
        forma_pagamento,
      },
    });

    return NextResponse.json(despesa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    return NextResponse.json({ error: "Erro ao criar despesa" }, { status: 500 });
  }
}
