"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import DespesaForm from "./components/DespesaForm";
import FiltroForm from "./components/FiltroForm";
import TabelaDespesas from "./components/TabelaDespesas";
import GraficosDespesas from "./components/GraficosDespesas";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";
import { Despesa, buscarDespesas, criarDespesa, atualizarDespesa, excluirDespesa } from "@/services/despesasService";

const Despesas = () => {
  // Estado para o modal de formulário de despesa
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // Estado para o modal de filtro
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // Estado para o modal de confirmação de exclusão
  const [exclusaoInfo, setExclusaoInfo] = useState<{ id: number; descricao: string } | null>(null);
  // Estado para a despesa em edição
  const [despesaEmEdicao, setDespesaEmEdicao] = useState<Despesa | undefined>(undefined);
  // Estado para os filtros aplicados
  const [filtrosAplicados, setFiltrosAplicados] = useState<any>({});
  // Estado para as despesas
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  // Estado de carregamento
  const [loading, setLoading] = useState(true);
  // Estado de erro
  const [erro, setErro] = useState<string | null>(null);

  // Função para carregar as despesas
  useEffect(() => {
    const carregarDespesas = async () => {
      try {
        setLoading(true);
        const dados = await buscarDespesas();
        setDespesas(dados);
        setErro(null);
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
        setErro("Não foi possível carregar as despesas.");
      } finally {
        setLoading(false);
      }
    };

    carregarDespesas();
  }, []);

  // Função para filtrar as despesas com base nos filtros aplicados
  const despesasFiltradas = despesas.filter((despesa) => {
    // Se não há filtros, retorna todas as despesas
    if (Object.keys(filtrosAplicados).length === 0) return true;

    // Filtrar por data de início
    if (filtrosAplicados.dataInicio && new Date(despesa.data) < new Date(filtrosAplicados.dataInicio)) {
      return false;
    }

    // Filtrar por data de fim
    if (filtrosAplicados.dataFim && new Date(despesa.data) > new Date(filtrosAplicados.dataFim)) {
      return false;
    }

    // Filtrar por valor mínimo
    if (filtrosAplicados.valorMin && despesa.valor < filtrosAplicados.valorMin) {
      return false;
    }

    // Filtrar por valor máximo
    if (filtrosAplicados.valorMax && despesa.valor > filtrosAplicados.valorMax) {
      return false;
    }

    // Filtrar por categorias
    if (filtrosAplicados.categorias && filtrosAplicados.categorias.length > 0) {
      if (!filtrosAplicados.categorias.includes(despesa.categoria)) {
        return false;
      }
    }

    // Filtrar por formas de pagamento
    if (filtrosAplicados.formasPagamento && filtrosAplicados.formasPagamento.length > 0) {
      if (!filtrosAplicados.formasPagamento.includes(despesa.forma_pagamento)) {
        return false;
      }
    }

    return true;
  });

  // Calcular o total de despesas filtradas
  const totalDespesas = despesasFiltradas.reduce((acc, despesa) => acc + despesa.valor, 0);

  // Função para adicionar/editar uma despesa
  const handleSaveDespesa = async (despesa: Despesa) => {
    try {
      setLoading(true);

      if (despesa.id) {
        // Editar despesa existente
        const despesaAtualizada = await atualizarDespesa(despesa);
        setDespesas(despesas.map((d) => (d.id === despesa.id ? despesaAtualizada : d)));
      } else {
        // Adicionar nova despesa
        const novaDespesa = await criarDespesa(despesa);
        setDespesas([...despesas, novaDespesa]);
      }

      // Fechar o modal de formulário
      setIsFormModalOpen(false);
      // Limpar a despesa em edição
      setDespesaEmEdicao(undefined);
      // Limpar erro
      setErro(null);
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      setErro("Não foi possível salvar a despesa.");
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de edição
  const handleEdit = (despesa: Despesa) => {
    setDespesaEmEdicao(despesa);
    setIsFormModalOpen(true);
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleDeleteConfirmation = (id: number) => {
    const despesa = despesas.find((d) => d.id === id);
    if (despesa) {
      setExclusaoInfo({ id, descricao: despesa.descricao });
    }
  };

  // Função para excluir uma despesa após confirmação
  const handleConfirmDelete = async () => {
    if (exclusaoInfo) {
      try {
        setLoading(true);
        await excluirDespesa(exclusaoInfo.id);
        setDespesas(despesas.filter((d) => d.id !== exclusaoInfo.id));
        setExclusaoInfo(null);
        setErro(null);
      } catch (error) {
        console.error("Erro ao excluir despesa:", error);
        setErro("Não foi possível excluir a despesa.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para aplicar filtros
  const handleApplyFilter = (filtros: any) => {
    setFiltrosAplicados(filtros);
    setIsFilterModalOpen(false);
  };

  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Componente de esqueleto para carregamento
  const CardSkeleton = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-2/3 mt-2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white shadow-sm rounded-xl p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  const GraphSkeleton = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-5"></div>
      <div className="h-80 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="space-y-6 w-[1200px]">
      {/* Cabeçalho com título e botões */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Despesas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer bg-white border border-gray-300"
          >
            <FiFilter size={18} />
            <span>Filtrar</span>
          </button>
          <button
            onClick={() => {
              setDespesaEmEdicao(undefined);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <FiPlus size={18} />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{erro}</span>
        </div>
      )}

      {/* Dashboard com cards */}
      <div className="">
        {/* Card com valor total de despesas */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total de Despesas</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">{formatPriceValue(totalDespesas)}</p>
            <div className="text-sm text-gray-500 mt-1">
              {despesasFiltradas.length} {despesasFiltradas.length === 1 ? "despesa" : "despesas"}
              {Object.keys(filtrosAplicados).length > 0}
            </div>
          </div>
        )}
      </div>

      {/* Gráficos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GraphSkeleton />
          <GraphSkeleton />
          <GraphSkeleton />
          <GraphSkeleton />
        </div>
      ) : (
        <GraficosDespesas despesas={despesasFiltradas} />
      )}

      {/* Tabela de despesas */}
      {loading ? (
        <TableSkeleton />
      ) : despesas.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p className="py-6">Nenhuma despesa encontrada. Adicione sua primeira despesa!</p>
        </div>
      ) : (
        <TabelaDespesas despesas={despesasFiltradas} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />
      )}

      {/* Modal para adicionar/editar despesa */}
      {isFormModalOpen && (
        <DespesaForm
          onClose={() => {
            setIsFormModalOpen(false);
            setDespesaEmEdicao(undefined);
          }}
          onSave={handleSaveDespesa}
          despesa={despesaEmEdicao}
        />
      )}

      {/* Modal para filtro */}
      {isFilterModalOpen && (
        <FiltroForm
          onClose={() => setIsFilterModalOpen(false)}
          onFilter={handleApplyFilter}
          filtrosAtuais={filtrosAplicados}
        />
      )}

      {/* Modal para confirmação de exclusão */}
      {exclusaoInfo && (
        <ConfirmacaoExclusao
          id={exclusaoInfo.id}
          descricao={exclusaoInfo.descricao}
          onConfirm={handleConfirmDelete}
          onCancel={() => setExclusaoInfo(null)}
        />
      )}
    </div>
  );
};

export default Despesas;
