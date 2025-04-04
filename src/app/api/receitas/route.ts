import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/receitas
export async function GET() {
  try {
    const receitas = await prisma.receita.findMany({
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json(receitas);
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return NextResponse.json({ error: "Erro ao buscar receitas" }, { status: 500 });
  }
}

// POST /api/receitas
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { descricao, data, valor, observacao } = body;

    if (!descricao || !data || !valor) {
      return NextResponse.json({ error: "Dados incompletos para criar receita" }, { status: 400 });
    }

    const receita = await prisma.receita.create({
      data: {
        descricao,
        data: new Date(data),
        valor: parseFloat(valor),
        observacao: observacao || null,
      },
    });

    return NextResponse.json(receita, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return NextResponse.json({ error: "Erro ao criar receita" }, { status: 500 });
  }
}
