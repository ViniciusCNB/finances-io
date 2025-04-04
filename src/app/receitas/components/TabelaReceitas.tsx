"use client";

import { useState } from "react";
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Receita {
  id: number;
  descricao: string;
  data: string;
  valor: number;
  observacao: string;
}

interface TabelaReceitasProps {
  receitas: Receita[];
  onEdit: (receita: Receita) => void;
  onDelete: (id: number) => void;
}

type OrderBy = "descricao" | "data" | "valor";
type OrderDirection = "asc" | "desc";

export default function TabelaReceitas({ receitas, onEdit, onDelete }: TabelaReceitasProps) {
  const [orderBy, setOrderBy] = useState<OrderBy>("data");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");

  const handleSort = (column: OrderBy) => {
    if (orderBy === column) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrderDirection("asc");
    }
  };

  const sortedReceitas = [...receitas].sort((a, b) => {
    let comparison = 0;

    switch (orderBy) {
      case "descricao":
        comparison = a.descricao.localeCompare(b.descricao);
        break;
      case "data":
        comparison = new Date(a.data).getTime() - new Date(b.data).getTime();
        break;
      case "valor":
        comparison = a.valor - b.valor;
        break;
    }

    return orderDirection === "asc" ? comparison : -comparison;
  });

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);

    // Ajustar o fuso horário adicionando o timezone UTC
    const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);

    return dataAjustada.toLocaleDateString("pt-BR");
  };

  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const SortArrow = ({ column }: { column: OrderBy }) => {
    if (orderBy !== column) return null;

    return orderDirection === "asc" ? (
      <FiArrowUp className="ml-1 inline" size={14} />
    ) : (
      <FiArrowDown className="ml-1 inline" size={14} />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("descricao")}
              >
                <span className="flex items-center">
                  Descrição
                  <SortArrow column="descricao" />
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("data")}
              >
                <span className="flex items-center">
                  Data
                  <SortArrow column="data" />
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("valor")}
              >
                <span className="flex items-center">
                  Valor
                  <SortArrow column="valor" />
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <span className="flex items-center">Observação</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReceitas.length > 0 ? (
              sortedReceitas.map((receita) => (
                <tr key={receita.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="truncate max-w-[150px]" title={receita.descricao}>
                        {receita.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(receita.data)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium text-green-600">
                    {formatPriceValue(receita.valor)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="truncate max-w-[200px]" title={receita.observacao}>
                      {receita.observacao || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onEdit(receita)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(receita.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma receita encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
