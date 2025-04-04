import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/receitas/[id]
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 });
    }

    const receita = await prisma.receita.findUnique({
      where: { id },
    });

    if (!receita) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    return NextResponse.json(receita);
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    return NextResponse.json({ error: "Erro ao buscar receita" }, { status: 500 });
  }
}

// PUT /api/receitas/[id]
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { descricao, data, valor, observacao } = body;

    // Verifica se a receita existe
    const receitaExistente = await prisma.receita.findUnique({
      where: { id },
    });

    if (!receitaExistente) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    // Atualiza a receita
    const receitaAtualizada = await prisma.receita.update({
      where: { id },
      data: {
        descricao: descricao ?? receitaExistente.descricao,
        data: data ? new Date(data) : receitaExistente.data,
        valor: valor !== undefined ? parseFloat(valor) : receitaExistente.valor,
        observacao: observacao ?? receitaExistente.observacao,
      },
    });

    return NextResponse.json(receitaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    return NextResponse.json({ error: "Erro ao atualizar receita" }, { status: 500 });
  }
}

// DELETE /api/receitas/[id]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 });
    }

    // Verifica se a receita existe
    const receita = await prisma.receita.findUnique({
      where: { id },
    });

    if (!receita) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    // Exclui a receita
    await prisma.receita.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Receita excluída com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return NextResponse.json({ error: "Erro ao excluir receita" }, { status: 500 });
  }
}
