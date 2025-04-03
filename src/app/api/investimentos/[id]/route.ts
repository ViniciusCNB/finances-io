import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/investimentos/[id]
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de investimento inválido" }, { status: 400 });
    }

    const investimento = await prisma.investimento.findUnique({
      where: { id },
    });

    if (!investimento) {
      return NextResponse.json({ error: "Investimento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(investimento);
  } catch (error) {
    console.error("Erro ao buscar investimento:", error);
    return NextResponse.json({ error: "Erro ao buscar investimento" }, { status: 500 });
  }
}

// PUT /api/investimentos/[id]
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de investimento inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { descricao, valor, quantidade, tipo, instituicao } = body;

    // Verifica se o investimento existe
    const investimentoExistente = await prisma.investimento.findUnique({
      where: { id },
    });

    if (!investimentoExistente) {
      return NextResponse.json({ error: "Investimento não encontrado" }, { status: 404 });
    }

    // Validar tipo se foi fornecido
    if (tipo) {
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
    }

    // Atualiza o investimento
    const investimentoAtualizado = await prisma.investimento.update({
      where: { id },
      data: {
        descricao: descricao ?? investimentoExistente.descricao,
        valor: valor !== undefined ? parseFloat(valor.toString()) : investimentoExistente.valor,
        quantidade: quantidade !== undefined ? parseFloat(quantidade.toString()) : investimentoExistente.quantidade,
        tipo: tipo ?? investimentoExistente.tipo,
        instituicao: instituicao ?? investimentoExistente.instituicao,
      },
    });

    return NextResponse.json(investimentoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar investimento:", error);
    return NextResponse.json({ error: "Erro ao atualizar investimento" }, { status: 500 });
  }
}

// DELETE /api/investimentos/[id]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de investimento inválido" }, { status: 400 });
    }

    // Verifica se o investimento existe
    const investimento = await prisma.investimento.findUnique({
      where: { id },
    });

    if (!investimento) {
      return NextResponse.json({ error: "Investimento não encontrado" }, { status: 404 });
    }

    // Exclui o investimento
    await prisma.investimento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Investimento excluído com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir investimento:", error);
    return NextResponse.json({ error: "Erro ao excluir investimento" }, { status: 500 });
  }
}
