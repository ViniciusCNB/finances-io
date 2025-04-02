"use client";

import { useState } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import DespesaForm from "./components/DespesaForm";
import FiltroForm from "./components/FiltroForm";
import TabelaDespesas from "./components/TabelaDespesas";
import GraficosDespesas from "./components/GraficosDespesas";
import ConfirmacaoExclusao from "./components/ConfirmacaoExclusao";

// Interface para o tipo de despesa
interface Despesa {
  id: number;
  descricao: string;
  data: string;
  valor: number;
  categoria_despesa: string;
  observacao: string;
  forma_pagamento: string;
}

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

  // Estado para as despesas (mock data para demonstração)
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: 1,
      descricao: "Aluguel",
      data: "2023-04-01",
      valor: 1200,
      categoria_despesa: "Moradia",
      observacao: "Pagamento mensal",
      forma_pagamento: "Pix",
    },
    {
      id: 2,
      descricao: "Supermercado",
      data: "2023-04-05",
      valor: 450.75,
      categoria_despesa: "Alimentação",
      observacao: "Compras da semana",
      forma_pagamento: "Cartão de Crédito",
    },
    {
      id: 3,
      descricao: "Internet",
      data: "2023-04-10",
      valor: 100,
      categoria_despesa: "Serviços",
      observacao: "Internet fibra",
      forma_pagamento: "Débito Automático",
    },
    {
      id: 4,
      descricao: "Restaurante",
      data: "2023-04-15",
      valor: 85.5,
      categoria_despesa: "Alimentação",
      observacao: "Almoço de domingo",
      forma_pagamento: "Cartão de Crédito",
    },
    {
      id: 5,
      descricao: "Farmácia",
      data: "2023-04-18",
      valor: 65.2,
      categoria_despesa: "Saúde",
      observacao: "Medicamentos",
      forma_pagamento: "Cartão de Débito",
    },
    {
      id: 6,
      descricao: "Combustível",
      data: "2023-04-20",
      valor: 200,
      categoria_despesa: "Transporte",
      observacao: "Abastecimento do carro",
      forma_pagamento: "Pix",
    },
    {
      id: 7,
      descricao: "Academia",
      data: "2023-05-01",
      valor: 120,
      categoria_despesa: "Lazer",
      observacao: "Mensalidade",
      forma_pagamento: "Débito Automático",
    },
  ]);

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
      if (!filtrosAplicados.categorias.includes(despesa.categoria_despesa)) {
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
  const handleSaveDespesa = (despesa: any) => {
    if (despesa.id) {
      // Editar despesa existente
      setDespesas(despesas.map((d) => (d.id === despesa.id ? { ...despesa } : d)));
    } else {
      // Adicionar nova despesa
      const novaDespesa = {
        ...despesa,
        id: Math.max(0, ...despesas.map((d) => d.id)) + 1,
      };
      setDespesas([...despesas, novaDespesa]);
    }

    // Fechar o modal de formulário
    setIsFormModalOpen(false);
    // Limpar a despesa em edição
    setDespesaEmEdicao(undefined);
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
  const handleConfirmDelete = () => {
    if (exclusaoInfo) {
      setDespesas(despesas.filter((d) => d.id !== exclusaoInfo.id));
      setExclusaoInfo(null);
    }
  };

  // Função para aplicar filtros
  const handleApplyFilter = (filtros: any) => {
    setFiltrosAplicados(filtros);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com título e botões */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Despesas</h1>
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
              setDespesaEmEdicao(undefined);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus size={18} />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* Dashboard com cards e gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card com total de despesas */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de Despesas</h3>
          <p className="text-3xl font-bold mt-2">R$ {totalDespesas.toFixed(2)}</p>
          <div className="text-sm text-gray-500 mt-1">
            {despesasFiltradas.length} {despesasFiltradas.length === 1 ? "despesa" : "despesas"}
            {Object.keys(filtrosAplicados).length > 0 ? " (filtradas)" : ""}
          </div>
        </div>

        {/* Gráficos */}
        <GraficosDespesas despesas={despesasFiltradas} />
      </div>

      {/* Tabela de despesas */}
      <TabelaDespesas despesas={despesasFiltradas} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />

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
