"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import ReceitaForm from "./components/ReceitaForm";
import FiltroForm from "./components/FiltroForm";
import TabelaReceitas from "./components/TabelaReceitas";
import GraficosReceitas from "./components/GraficosReceitas";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";
import { Receita, buscarReceitas, criarReceita, atualizarReceita, excluirReceita } from "@/services/receitasService";

const Receitas = () => {
  // Estado para o modal de formulário de receita
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // Estado para o modal de filtro
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // Estado para o modal de confirmação de exclusão
  const [exclusaoInfo, setExclusaoInfo] = useState<{ id: number; descricao: string } | null>(null);
  // Estado para a receita em edição
  const [receitaEmEdicao, setReceitaEmEdicao] = useState<Receita | undefined>(undefined);
  // Estado para os filtros aplicados
  const [filtrosAplicados, setFiltrosAplicados] = useState<any>({});
  // Estado para as receitas
  const [receitas, setReceitas] = useState<Receita[]>([]);
  // Estado para carregamento
  const [loading, setLoading] = useState(true);
  // Estado para erros
  const [erro, setErro] = useState<string | null>(null);

  // Função para carregar as receitas
  useEffect(() => {
    const carregarReceitas = async () => {
      setLoading(true);
      setErro(null);
      try {
        const dadosReceitas = await buscarReceitas();
        setReceitas(dadosReceitas);
      } catch (error) {
        console.error("Erro ao carregar receitas:", error);
        setErro("Não foi possível carregar as receitas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    carregarReceitas();
  }, []);

  const receitasFiltradas = receitas.filter((receita) => {
    // Se não há filtros, retorna todas as receitas
    if (Object.keys(filtrosAplicados).length === 0) return true;

    if (filtrosAplicados.dataInicio && new Date(receita.data) < new Date(filtrosAplicados.dataInicio)) {
      return false;
    }

    if (filtrosAplicados.dataFim && new Date(receita.data) > new Date(filtrosAplicados.dataFim)) {
      return false;
    }

    if (filtrosAplicados.valorMin && receita.valor < filtrosAplicados.valorMin) {
      return false;
    }

    if (filtrosAplicados.valorMax && receita.valor > filtrosAplicados.valorMax) {
      return false;
    }

    return true;
  });

  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + receita.valor, 0);

  const handleSaveReceita = async (receita: Receita) => {
    setLoading(true);
    setErro(null);
    try {
      if (receita.id) {
        const receitaAtualizada = await atualizarReceita(receita);
        setReceitas(receitas.map((r) => (r.id === receita.id ? receitaAtualizada : r)));
      } else {
        const novaReceita = await criarReceita(receita);
        setReceitas([...receitas, novaReceita]);
      }
      setIsFormModalOpen(false);
      setReceitaEmEdicao(undefined);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      setErro("Não foi possível salvar a receita. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (receita: Receita) => {
    setReceitaEmEdicao(receita);
    setIsFormModalOpen(true);
  };

  const handleDeleteConfirmation = (id: number) => {
    const receita = receitas.find((r) => r.id === id);
    if (receita) {
      setExclusaoInfo({ id, descricao: receita.descricao });
    }
  };

  // Função para excluir uma receita após confirmação
  const handleConfirmDelete = async () => {
    if (exclusaoInfo) {
      setLoading(true);
      setErro(null);
      try {
        await excluirReceita(exclusaoInfo.id);
        setReceitas(receitas.filter((r) => r.id !== exclusaoInfo.id));
        setExclusaoInfo(null);
      } catch (error) {
        console.error("Erro ao excluir receita:", error);
        setErro("Não foi possível excluir a receita. Tente novamente mais tarde.");
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
        <h1 className="text-3xl font-bold text-black">Receitas</h1>
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
              setReceitaEmEdicao(undefined);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition"
          >
            <FiPlus size={18} />
            <span>Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>}

      {/* Dashboard com cards e gráficos */}
      <div className="">
        {/* Card com total de receitas */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total de Receitas</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{formatPriceValue(totalReceitas)}</p>
            <div className="text-sm text-gray-500 mt-1">
              {receitasFiltradas.length} {receitasFiltradas.length === 1 ? "receita" : "receitas"}
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
        <GraficosReceitas receitas={receitasFiltradas} />
      )}

      {/* Tabela de receitas */}
      {loading ? (
        <TableSkeleton />
      ) : receitas.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p className="py-6">Nenhuma receita encontrada. Adicione sua primeira receita!</p>
        </div>
      ) : (
        <TabelaReceitas receitas={receitasFiltradas} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />
      )}

      {/* Modal para adicionar/editar receita */}
      {isFormModalOpen && (
        <ReceitaForm
          onClose={() => {
            setIsFormModalOpen(false);
            setReceitaEmEdicao(undefined);
          }}
          onSave={handleSaveReceita}
          receita={receitaEmEdicao}
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

export default Receitas;
