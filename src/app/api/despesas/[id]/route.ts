import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/despesas/[id]
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de despesa inválido" }, { status: 400 });
    }

    const despesa = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesa) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(despesa);
  } catch (error) {
    console.error("Erro ao buscar despesa:", error);
    return NextResponse.json({ error: "Erro ao buscar despesa" }, { status: 500 });
  }
}

// PUT /api/despesas/[id]
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de despesa inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { descricao, data, valor, categoria, observacao, forma_pagamento } = body;

    // Verifica se a despesa existe
    const despesaExistente = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesaExistente) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    // Atualiza a despesa
    const despesaAtualizada = await prisma.despesa.update({
      where: { id },
      data: {
        descricao: descricao ?? despesaExistente.descricao,
        data: data ? new Date(data) : despesaExistente.data,
        valor: valor !== undefined ? parseFloat(valor) : despesaExistente.valor,
        categoria: categoria ?? despesaExistente.categoria,
        observacao: observacao ?? despesaExistente.observacao,
        forma_pagamento: forma_pagamento ?? despesaExistente.forma_pagamento,
      },
    });

    return NextResponse.json(despesaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    return NextResponse.json({ error: "Erro ao atualizar despesa" }, { status: 500 });
  }
}

// DELETE /api/despesas/[id]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de despesa inválido" }, { status: 400 });
    }

    // Verifica se a despesa existe
    const despesa = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesa) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    // Exclui a despesa
    await prisma.despesa.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Despesa excluída com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir despesa:", error);
    return NextResponse.json({ error: "Erro ao excluir despesa" }, { status: 500 });
  }
}
