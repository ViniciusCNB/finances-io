"use client";

import { useState } from "react";
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Despesa } from "@/services/despesasService";

interface TabelaDespesasProps {
  despesas: Despesa[];
  onEdit: (despesa: Despesa) => void;
  onDelete: (id: number) => void;
}

type OrderBy = "descricao" | "data" | "valor" | "categoria" | "forma_pagamento";
type OrderDirection = "asc" | "desc";

export default function TabelaDespesas({ despesas, onEdit, onDelete }: TabelaDespesasProps) {
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

  const sortedDespesas = [...despesas].sort((a, b) => {
    let comparison = 0;

    switch (orderBy) {
      case "descricao":
        comparison = a.descricao.localeCompare(b.descricao);
        break;
      case "data":
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case "valor":
        comparison = a.valor - b.valor;
        break;
      case "categoria":
        comparison = a.categoria.localeCompare(b.categoria);
        break;
      case "forma_pagamento":
        comparison = a.forma_pagamento.localeCompare(b.forma_pagamento);
        break;
    }

    return orderDirection === "asc" ? comparison : -comparison;
  });

  const formatarData = (dataString: string | Date) => {
    const data = dataString instanceof Date ? dataString : new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const SortArrow = ({ column }: { column: OrderBy }) => {
    if (orderBy !== column) return null;

    return orderDirection === "asc" ? (
      <FiArrowUp className="ml-1 inline" size={14} />
    ) : (
      <FiArrowDown className="ml-1 inline" size={14} />
    );
  };

  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("categoria")}
              >
                <span className="flex items-center">
                  Categoria
                  <SortArrow column="categoria" />
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("forma_pagamento")}
              >
                <span className="flex items-center">
                  Forma de Pagamento
                  <SortArrow column="forma_pagamento" />
                </span>
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
            {sortedDespesas.length > 0 ? (
              sortedDespesas.map((despesa) => (
                <tr key={despesa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="truncate max-w-[150px]" title={despesa.descricao}>
                        {despesa.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(despesa.data)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPriceValue(despesa.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{despesa.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{despesa.forma_pagamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onEdit(despesa)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(despesa.id as number)}
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
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma despesa encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
