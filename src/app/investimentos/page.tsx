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
  const [loading, setLoading] = useState(false);

  // Estado para controle de erros
  const [erro, setErro] = useState<string | null>(null);

  // Função para carregar os investimentos da API
  useEffect(() => {
    const carregarInvestimentos = async () => {
      setLoading(true);
      setErro(null);
      try {
        const dados = await buscarInvestimentos();
        setInvestimentos(dados);
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
    <div className="w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Investimentos</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setModalAberto("filtrar")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <FiFilter />
            Filtrar
          </button>

          <button
            onClick={() => {
              setInvestimentoAtual(null);
              setModalAberto("adicionar");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            <FiPlus />
            Novo Investimento
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{erro}</div>}

      {/* Dashboard Card */}
      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Investido</h2>
        <div className="flex items-end gap-4">
          {loading && investimentos.length === 0 ? (
            <div className="text-3xl font-bold text-purple-600">Carregando...</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-purple-600">{formatarPreco(valorTotalInvestimentos)}</div>
              <div className="text-sm text-gray-500">{investimentosFiltrados.length} investimentos</div>
            </>
          )}
        </div>
      </div>

      {/* Gráficos */}
      <div className="mb-8">
        {loading && investimentos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>Carregando gráficos...</p>
          </div>
        ) : investimentos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>Nenhum investimento encontrado. Adicione seu primeiro investimento!</p>
          </div>
        ) : (
          <GraficosInvestimentos investimentos={investimentosFiltrados} formatarPreco={formatarPreco} />
        )}
      </div>

      {/* Tabela de Investimentos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seus Investimentos</h2>
        {loading && investimentos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>Carregando investimentos...</p>
          </div>
        ) : investimentos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>Nenhum investimento encontrado. Adicione seu primeiro investimento!</p>
          </div>
        ) : (
          <TabelaInvestimentos
            investimentos={investimentosFiltrados}
            onEdit={editarInvestimento}
            onDelete={confirmarExclusao}
            formatarPreco={formatarPreco}
          />
        )}
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
          tiposInvestimento={TIPOS_INVESTIMENTO}
          investimentos={investimentos}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalAberto === "confirmarExclusao" && investimentoAtual && (
        <ConfirmacaoExclusao
          id={investimentoAtual.id}
          descricao={investimentoAtual.descricao}
          onConfirm={excluirInvestimento}
          onCancel={() => setModalAberto(null)}
        />
      )}
    </div>
  );
}
