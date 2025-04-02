"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiPlus } from "react-icons/fi";
import InvestimentoForm from "./components/InvestimentoForm";
import FiltroForm from "./components/FiltroForm";
import TabelaInvestimentos from "./components/TabelaInvestimentos";
import GraficosInvestimentos from "./components/GraficosInvestimentos";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";

// Interface para representar o modelo de Investimento
interface Investimento {
  id: number;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo: string;
  instituicao: string;
}

// Tipos de investimento disponíveis (readonly para evitar mudanças acidentais)
export const TIPOS_INVESTIMENTO = [
  "Ações",
  "Fundos Imobiliários",
  "Tesouro Direto",
  "CDB",
  "LCI/LCA",
  "Criptomoedas",
  "Fundos de Investimento",
  "Poupança",
  "Outros",
] as const;

export default function Investimentos() {
  // Estado para controlar a exibição de modais
  const [modalAberto, setModalAberto] = useState<"adicionar" | "editar" | "filtrar" | "confirmarExclusao" | null>(null);

  // Estado para armazenar o investimento sendo editado ou excluído
  const [investimentoAtual, setInvestimentoAtual] = useState<Investimento | null>(null);

  // Estado para armazenar a lista de investimentos
  const [investimentos, setInvestimentos] = useState<Investimento[]>([
    // Dados de exemplo para demonstração
    {
      id: 1,
      descricao: "PETR4 - Petrobras",
      valor: 28.5,
      quantidade: 100,
      tipo: "Ações",
      instituicao: "Corretora XP",
    },
    {
      id: 2,
      descricao: "KNRI11 - Kinea Renda Imobiliária",
      valor: 142.8,
      quantidade: 50,
      tipo: "Fundos Imobiliários",
      instituicao: "Corretora XP",
    },
    {
      id: 3,
      descricao: "Tesouro IPCA+ 2026",
      valor: 3500.0,
      quantidade: 1,
      tipo: "Tesouro Direto",
      instituicao: "Banco do Brasil",
    },
    {
      id: 4,
      descricao: "Bitcoin",
      valor: 180000.0,
      quantidade: 0.05,
      tipo: "Criptomoedas",
      instituicao: "Binance",
    },
    {
      id: 5,
      descricao: "CDB Banco Inter - 120%",
      valor: 10000.0,
      quantidade: 1,
      tipo: "CDB",
      instituicao: "Banco Inter",
    },
    {
      id: 6,
      descricao: "Poupança",
      valor: 5000.0,
      quantidade: 1,
      tipo: "Poupança",
      instituicao: "Caixa Econômica",
    },
  ]);

  // Estado para armazenar os filtros aplicados
  const [filtrosAplicados, setFiltrosAplicados] = useState<{
    valorMin?: number;
    valorMax?: number;
    tipos?: string[];
    instituicoes?: string[];
  }>({});

  // Filtrar investimentos baseado nos filtros aplicados
  const investimentosFiltrados = investimentos.filter((inv) => {
    const valorTotal = inv.valor * inv.quantidade;

    // Filtro de valor mínimo
    if (filtrosAplicados.valorMin && valorTotal < filtrosAplicados.valorMin) {
      return false;
    }

    // Filtro de valor máximo
    if (filtrosAplicados.valorMax && valorTotal > filtrosAplicados.valorMax) {
      return false;
    }

    // Filtro de tipos
    if (filtrosAplicados.tipos && filtrosAplicados.tipos.length > 0) {
      if (!filtrosAplicados.tipos.includes(inv.tipo)) {
        return false;
      }
    }

    // Filtro de instituições
    if (filtrosAplicados.instituicoes && filtrosAplicados.instituicoes.length > 0) {
      if (!filtrosAplicados.instituicoes.includes(inv.instituicao)) {
        return false;
      }
    }

    return true;
  });

  // Calcular o valor total dos investimentos filtrados
  const valorTotalInvestimentos = investimentosFiltrados.reduce((total, inv) => total + inv.valor * inv.quantidade, 0);

  // Função para salvar um novo investimento ou atualizar um existente
  const salvarInvestimento = (investimento: Investimento) => {
    if (investimento.id) {
      // Atualizar investimento existente
      setInvestimentos((prev) => prev.map((inv) => (inv.id === investimento.id ? investimento : inv)));
    } else {
      // Adicionar novo investimento
      const novoId = Math.max(0, ...investimentos.map((inv) => inv.id)) + 1;
      setInvestimentos((prev) => [...prev, { ...investimento, id: novoId }]);
    }

    // Fechar o modal
    setModalAberto(null);
  };

  // Função para iniciar a edição de um investimento
  const editarInvestimento = (investimento: Investimento) => {
    setInvestimentoAtual(investimento);
    setModalAberto("editar");
  };

  // Função para iniciar o processo de exclusão
  const confirmarExclusao = (investimento: Investimento) => {
    setInvestimentoAtual(investimento);
    setModalAberto("confirmarExclusao");
  };

  // Função para excluir um investimento
  const excluirInvestimento = () => {
    if (investimentoAtual) {
      setInvestimentos((prev) => prev.filter((inv) => inv.id !== investimentoAtual.id));
      setModalAberto(null);
      setInvestimentoAtual(null);
    }
  };

  // Função para aplicar filtros
  const aplicarFiltros = (filtros: any) => {
    setFiltrosAplicados(filtros);
    setModalAberto(null);
  };

  // Formatar valores monetários
  const formatarPreco = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Investimentos</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setModalAberto("filtrar")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiFilter />
            Filtrar
          </button>

          <button
            onClick={() => {
              setInvestimentoAtual(null);
              setModalAberto("adicionar");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FiPlus />
            Adicionar Investimento
          </button>
        </div>
      </div>

      {/* Dashboard Card */}
      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Investido</h2>
        <div className="flex items-end gap-4">
          <div className="text-3xl font-bold text-purple-600">{formatarPreco(valorTotalInvestimentos)}</div>
          <div className="text-sm text-gray-500">{investimentosFiltrados.length} investimentos</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mb-8">
        <GraficosInvestimentos investimentos={investimentosFiltrados} formatarPreco={formatarPreco} />
      </div>

      {/* Tabela de Investimentos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seus Investimentos</h2>
        <TabelaInvestimentos
          investimentos={investimentosFiltrados}
          onEdit={editarInvestimento}
          onDelete={confirmarExclusao}
          formatarPreco={formatarPreco}
        />
      </div>

      {/* Modal de Adicionar/Editar Investimento */}
      {(modalAberto === "adicionar" || modalAberto === "editar") && (
        <InvestimentoForm
          onClose={() => setModalAberto(null)}
          onSave={salvarInvestimento}
          investimento={investimentoAtual || undefined}
          tiposInvestimento={TIPOS_INVESTIMENTO}
        />
      )}

      {/* Modal de Filtro */}
      {modalAberto === "filtrar" && (
        <FiltroForm
          onClose={() => setModalAberto(null)}
          onFilter={aplicarFiltros}
          filtrosAtuais={filtrosAplicados}
          investimentos={investimentos}
          tiposInvestimento={TIPOS_INVESTIMENTO}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalAberto === "confirmarExclusao" && investimentoAtual && (
        <ConfirmacaoExclusao
          onClose={() => setModalAberto(null)}
          onConfirm={excluirInvestimento}
          item={investimentoAtual}
        />
      )}
    </div>
  );
}
