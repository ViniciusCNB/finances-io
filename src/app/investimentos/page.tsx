"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiPlus } from "react-icons/fi";
import InvestimentoForm from "./components/InvestimentoForm";
import FiltroForm from "./components/FiltroForm";
import TabelaInvestimentos from "./components/TabelaInvestimentos";
import GraficosInvestimentos from "./components/GraficosInvestimentos";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";
import {
  Investimento,
  buscarInvestimentos,
  criarInvestimento,
  atualizarInvestimento,
  excluirInvestimento as excluirInvestimentoAPI,
} from "@/services/investimentosService";

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
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);

  // Estado para controle de carregamento
  const [loading, setLoading] = useState(true);

  // Estado para controle de erros
  const [erro, setErro] = useState<string | null>(null);

  // Função para carregar os investimentos da API
  useEffect(() => {
    const carregarInvestimentos = async () => {
      setLoading(true);
      try {
        const dadosInvestimentos = await buscarInvestimentos();

        // Adicionar data_compra temporária para investimentos existentes que não a possuem
        // Este código pode ser removido quando todos os investimentos já tiverem data_compra no banco
        const investimentosComDataCompra = dadosInvestimentos.map((inv) => {
          if (!inv.data_compra) {
            return {
              ...inv,
              data_compra: new Date().toISOString().split("T")[0],
            };
          }
          return inv;
        });

        setInvestimentos(investimentosComDataCompra);
        setErro(null);
      } catch (error) {
        console.error("Erro ao carregar investimentos:", error);
        setErro("Não foi possível carregar os investimentos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    carregarInvestimentos();
  }, []);

  // Estado para armazenar os filtros aplicados
  const [filtros, setFiltros] = useState<{
    valorMin?: number;
    valorMax?: number;
    tipos?: string[];
    instituicoes?: string[];
    dataInicio?: string;
    dataFim?: string;
  }>({});

  // Aplicar filtros aos investimentos
  const investimentosFiltrados = investimentos.filter((inv) => {
    // Verificar filtro de valor mínimo
    if (filtros.valorMin && inv.valor < parseFloat(String(filtros.valorMin))) {
      return false;
    }

    // Verificar filtro de valor máximo
    if (filtros.valorMax && inv.valor > parseFloat(String(filtros.valorMax))) {
      return false;
    }

    // Verificar filtro de tipos
    if (filtros.tipos && filtros.tipos.length > 0 && !filtros.tipos.includes(inv.tipo)) {
      return false;
    }

    // Verificar filtro de instituições
    if (filtros.instituicoes && filtros.instituicoes.length > 0 && !filtros.instituicoes.includes(inv.instituicao)) {
      return false;
    }

    // Verificar filtro de data de início
    if (filtros.dataInicio) {
      const dataCompra = new Date(inv.data_compra);
      const dataInicio = new Date(filtros.dataInicio);
      if (dataCompra < dataInicio) {
        return false;
      }
    }

    // Verificar filtro de data de fim
    if (filtros.dataFim) {
      const dataCompra = new Date(inv.data_compra);
      const dataFim = new Date(filtros.dataFim);
      if (dataCompra > dataFim) {
        return false;
      }
    }

    return true;
  });

  // Calcular o valor total dos investimentos filtrados
  const valorTotalInvestimentos = investimentosFiltrados.reduce((total, inv) => total + inv.valor * inv.quantidade, 0);

  // Função para salvar um novo investimento ou atualizar um existente
  const salvarInvestimento = async (investimento: Investimento) => {
    setLoading(true);
    setErro(null);
    try {
      if (investimento.id) {
        // Atualizar investimento existente
        const investimentoAtualizado = await atualizarInvestimento(investimento);
        setInvestimentos((prev) => prev.map((inv) => (inv.id === investimento.id ? investimentoAtualizado : inv)));
      } else {
        // Adicionar novo investimento
        const novoInvestimento = await criarInvestimento(investimento);
        setInvestimentos((prev) => [...prev, novoInvestimento]);
      }
      // Fechar o modal
      setModalAberto(null);
    } catch (error) {
      console.error("Erro ao salvar investimento:", error);
      setErro("Não foi possível salvar o investimento. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
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
  const excluirInvestimento = async () => {
    if (investimentoAtual?.id) {
      setLoading(true);
      setErro(null);
      try {
        await excluirInvestimentoAPI(investimentoAtual.id);
        setInvestimentos((prev) => prev.filter((inv) => inv.id !== investimentoAtual.id));
        setModalAberto(null);
        setInvestimentoAtual(null);
      } catch (error) {
        console.error("Erro ao excluir investimento:", error);
        setErro("Não foi possível excluir o investimento. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para aplicar filtros
  const aplicarFiltros = (filtros: any) => {
    setFiltros(filtros);
    setModalAberto(null);
  };

  // Formatar valores monetários
  const formatarPreco = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Componentes de esqueleto para carregamento
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow mb-8 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="flex items-end gap-4">
        <div className="h-8 bg-gray-200 rounded w-2/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
      </div>
    </div>
  );

  const GraphSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-5"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Investimentos</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setModalAberto("filtrar")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <FiFilter />
            Filtrar
          </button>

          <button
            onClick={() => {
              setInvestimentoAtual(null);
              setModalAberto("adicionar");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer"
          >
            <FiPlus />
            Novo Investimento
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{erro}</div>}

      {/* Dashboard Card */}
      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="p-6 bg-white rounded-xl shadow-sm mb-8">
          <h3 className="text-sm font-medium text-gray-500">Total Investido</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">{formatarPreco(valorTotalInvestimentos)}</p>
          <div className="text-sm text-gray-500 mt-1">
            {investimentosFiltrados.length} {investimentosFiltrados.length === 1 ? "investimento" : "investimentos"}
            {Object.keys(filtros).length > 0}
          </div>
        </div>
      )}

      {/* Gráficos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GraphSkeleton />
          <GraphSkeleton />
        </div>
      ) : (
        <div className="mb-8">
          <GraficosInvestimentos investimentos={investimentosFiltrados} formatarPreco={formatarPreco} />
        </div>
      )}

      {/* Tabela de investimentos */}
      {loading ? (
        <TableSkeleton />
      ) : investimentos.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm text-center py-12">
          <p className="text-gray-500">Nenhum investimento encontrado. Crie seu primeiro investimento!</p>
        </div>
      ) : (
        <TabelaInvestimentos
          investimentos={investimentosFiltrados}
          onEdit={editarInvestimento}
          onDelete={confirmarExclusao}
          formatarPreco={formatarPreco}
        />
      )}

      {/* Modais */}
      {modalAberto === "adicionar" && (
        <InvestimentoForm
          onClose={() => setModalAberto(null)}
          onSave={salvarInvestimento}
          tiposInvestimento={TIPOS_INVESTIMENTO}
        />
      )}

      {modalAberto === "editar" && investimentoAtual && (
        <InvestimentoForm
          onClose={() => setModalAberto(null)}
          onSave={salvarInvestimento}
          investimento={investimentoAtual}
          tiposInvestimento={TIPOS_INVESTIMENTO}
        />
      )}

      {modalAberto === "filtrar" && (
        <FiltroForm
          onClose={() => setModalAberto(null)}
          onFilter={aplicarFiltros}
          filtrosAtuais={filtros}
          investimentos={investimentos}
          tiposInvestimento={TIPOS_INVESTIMENTO}
        />
      )}

      {modalAberto === "confirmarExclusao" && investimentoAtual && (
        <ConfirmacaoExclusao
          id={investimentoAtual.id as number}
          descricao={investimentoAtual.descricao}
          onConfirm={excluirInvestimento}
          onCancel={() => setModalAberto(null)}
        />
      )}
    </div>
  );
}
