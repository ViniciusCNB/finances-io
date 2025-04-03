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
  const [loading, setLoading] = useState(false);
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

  // Função para filtrar as receitas com base nos filtros aplicados
  const receitasFiltradas = receitas.filter((receita) => {
    // Se não há filtros, retorna todas as receitas
    if (Object.keys(filtrosAplicados).length === 0) return true;

    // Filtrar por data de início
    if (filtrosAplicados.dataInicio && new Date(receita.data) < new Date(filtrosAplicados.dataInicio)) {
      return false;
    }

    // Filtrar por data de fim
    if (filtrosAplicados.dataFim && new Date(receita.data) > new Date(filtrosAplicados.dataFim)) {
      return false;
    }

    // Filtrar por valor mínimo
    if (filtrosAplicados.valorMin && receita.valor < filtrosAplicados.valorMin) {
      return false;
    }

    // Filtrar por valor máximo
    if (filtrosAplicados.valorMax && receita.valor > filtrosAplicados.valorMax) {
      return false;
    }

    return true;
  });

  // Calcular o total de receitas filtradas
  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + receita.valor, 0);

  // Função para adicionar/editar uma receita
  const handleSaveReceita = async (receita: Receita) => {
    setLoading(true);
    setErro(null);
    try {
      if (receita.id) {
        // Editar receita existente
        const receitaAtualizada = await atualizarReceita(receita);
        setReceitas(receitas.map((r) => (r.id === receita.id ? receitaAtualizada : r)));
      } else {
        // Adicionar nova receita
        const novaReceita = await criarReceita(receita);
        setReceitas([...receitas, novaReceita]);
      }
      // Fechar o modal de formulário
      setIsFormModalOpen(false);
      // Limpar a receita em edição
      setReceitaEmEdicao(undefined);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      setErro("Não foi possível salvar a receita. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de edição
  const handleEdit = (receita: Receita) => {
    setReceitaEmEdicao(receita);
    setIsFormModalOpen(true);
  };

  // Função para abrir o modal de confirmação de exclusão
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

  return (
    <div className="space-y-6 w-[1200px]">
      {/* Cabeçalho com título e botões */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Receitas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FiFilter size={18} />
            <span>Filtrar</span>
          </button>
          <button
            onClick={() => {
              setReceitaEmEdicao(undefined);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            <FiPlus size={18} />
            <span>Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{erro}</div>}

      {/* Dashboard com cards e gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card com total de receitas */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de Receitas</h3>
          {loading ? (
            <p className="text-3xl font-bold mt-2">Carregando...</p>
          ) : (
            <>
              <p className="text-3xl font-bold mt-2">{formatPriceValue(totalReceitas)}</p>
              <div className="text-sm text-gray-500 mt-1">
                {receitasFiltradas.length} {receitasFiltradas.length === 1 ? "receita" : "receitas"}
                {Object.keys(filtrosAplicados).length > 0 ? " (filtradas)" : ""}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gráficos */}
      {loading ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p>Carregando gráficos...</p>
        </div>
      ) : (
        <GraficosReceitas receitas={receitasFiltradas} />
      )}

      {/* Tabela de receitas */}
      {loading && receitas.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p>Carregando receitas...</p>
        </div>
      ) : receitas.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p>Nenhuma receita encontrada. Adicione sua primeira receita!</p>
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
