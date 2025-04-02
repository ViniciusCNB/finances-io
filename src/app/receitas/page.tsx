"use client";

import { useState } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import ReceitaForm from "./components/ReceitaForm";
import FiltroForm from "./components/FiltroForm";
import TabelaReceitas from "./components/TabelaReceitas";
import GraficosReceitas from "./components/GraficosReceitas";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";

// Interface para o tipo de receita
interface Receita {
  id: number;
  descricao: string;
  data: string;
  valor: number;
  observacao: string;
}

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

  // Estado para as receitas (mock data para demonstração)
  const [receitas, setReceitas] = useState<Receita[]>([
    {
      id: 1,
      descricao: "Salário",
      data: "2023-04-05",
      valor: 3500,
      observacao: "Pagamento mensal",
    },
    {
      id: 2,
      descricao: "Freelance",
      data: "2023-04-15",
      valor: 800,
      observacao: "Projeto de design",
    },
    {
      id: 3,
      descricao: "Venda de item",
      data: "2023-04-20",
      valor: 350,
      observacao: "Venda pelo Marketplace",
    },
    {
      id: 4,
      descricao: "Dividendos",
      data: "2023-05-10",
      valor: 120,
      observacao: "Ações PETR4",
    },
    {
      id: 5,
      descricao: "Restituição IR",
      data: "2023-06-15",
      valor: 1200,
      observacao: "Restituição anual",
    },
    {
      id: 6,
      descricao: "Salário",
      data: "2023-05-05",
      valor: 3500,
      observacao: "Pagamento mensal",
    },
    {
      id: 7,
      descricao: "Salário",
      data: "2023-06-05",
      valor: 3500,
      observacao: "Pagamento mensal",
    },
    {
      id: 8,
      descricao: "Salário",
      data: "2023-07-05",
      valor: 3700,
      observacao: "Pagamento mensal com aumento",
    },
  ]);

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
  const handleSaveReceita = (receita: any) => {
    if (receita.id) {
      // Editar receita existente
      setReceitas(receitas.map((r) => (r.id === receita.id ? { ...receita } : r)));
    } else {
      // Adicionar nova receita
      const novaReceita = {
        ...receita,
        id: Math.max(0, ...receitas.map((r) => r.id)) + 1,
      };
      setReceitas([...receitas, novaReceita]);
    }

    // Fechar o modal de formulário
    setIsFormModalOpen(false);
    // Limpar a receita em edição
    setReceitaEmEdicao(undefined);
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
  const handleConfirmDelete = () => {
    if (exclusaoInfo) {
      setReceitas(receitas.filter((r) => r.id !== exclusaoInfo.id));
      setExclusaoInfo(null);
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
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiPlus size={18} />
            <span>Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Dashboard com cards e gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card com total de receitas */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de Receitas</h3>
          <p className="text-3xl font-bold mt-2">{formatPriceValue(totalReceitas)}</p>
          <div className="text-sm text-gray-500 mt-1">
            {receitasFiltradas.length} {receitasFiltradas.length === 1 ? "receita" : "receitas"}
            {Object.keys(filtrosAplicados).length > 0 ? " (filtradas)" : ""}
          </div>
        </div>
      </div>

      {/* Tabela de receitas */}
      <TabelaReceitas receitas={receitasFiltradas} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />

      {/* Gráficos */}
      <GraficosReceitas receitas={receitasFiltradas} />

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
