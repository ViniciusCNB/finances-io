"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Investimento } from "@/services/investimentosService";

interface TabelaInvestimentosProps {
  investimentos: Investimento[];
  onEdit: (investimento: Investimento) => void;
  onDelete: (investimento: Investimento) => void;
  formatarPreco: (valor: number) => string;
}

export default function TabelaInvestimentos({
  investimentos,
  onEdit,
  onDelete,
  formatarPreco,
}: TabelaInvestimentosProps) {
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof Investimento | "valorTotal";
    direcao: "asc" | "desc";
  }>({
    campo: "descricao",
    direcao: "asc",
  });

  const alterarOrdenacao = (campo: keyof Investimento | "valorTotal") => {
    if (ordenacao.campo === campo) {
      setOrdenacao({
        campo,
        direcao: ordenacao.direcao === "asc" ? "desc" : "asc",
      });
    } else {
      setOrdenacao({
        campo,
        direcao: "asc",
      });
    }
  };

  const investimentosOrdenados = [...investimentos].sort((a, b) => {
    // Caso especial para valorTotal (calculado)
    if (ordenacao.campo === "valorTotal") {
      const valorTotalA = a.valor * a.quantidade;
      const valorTotalB = b.valor * b.quantidade;

      return ordenacao.direcao === "asc" ? valorTotalA - valorTotalB : valorTotalB - valorTotalA;
    }

    // Ordenação para campos normais
    const valorA = a[ordenacao.campo];
    const valorB = b[ordenacao.campo];

    if (typeof valorA === "string" && typeof valorB === "string") {
      return ordenacao.direcao === "asc" ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    }

    // Ordenação para números
    if (typeof valorA === "number" && typeof valorB === "number") {
      return ordenacao.direcao === "asc" ? valorA - valorB : valorB - valorA;
    }

    return 0;
  });

  const IconeOrdenacao = ({ campo, className = "" }: { campo: string; className?: string }) => {
    if (ordenacao.campo !== campo) return null;

    return ordenacao.direcao === "asc" ? (
      <FiChevronUp className={className} />
    ) : (
      <FiChevronDown className={className} />
    );
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    // Ajustar o fuso horário adicionando o timezone UTC
    const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    return dataAjustada.toLocaleDateString("pt-BR");
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("descricao")}
            >
              <div className="flex items-center">
                Descrição
                <IconeOrdenacao campo="descricao" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("tipo")}
            >
              <div className="flex items-center">
                Tipo
                <IconeOrdenacao campo="tipo" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("data_compra")}
            >
              <div className="flex items-center">
                Data de Compra
                <IconeOrdenacao campo="data_compra" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("instituicao")}
            >
              <div className="flex items-center">
                Instituição
                <IconeOrdenacao campo="instituicao" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("valor")}
            >
              <div className="flex items-center">
                Valor Unitário
                <IconeOrdenacao campo="valor" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("quantidade")}
            >
              <div className="flex items-center">
                Quantidade
                <IconeOrdenacao campo="quantidade" className="ml-1" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              onClick={() => alterarOrdenacao("valorTotal")}
            >
              <div className="flex items-center">
                Valor Total
                <IconeOrdenacao campo="valorTotal" className="ml-1" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {investimentosOrdenados.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                Nenhum investimento encontrado
              </td>
            </tr>
          ) : (
            investimentosOrdenados.map((investimento) => (
              <tr key={investimento.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {investimento.descricao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investimento.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarData(investimento.data_compra)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investimento.instituicao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarPreco(investimento.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investimento.quantidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarPreco(investimento.valor * investimento.quantidade)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit(investimento)}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(investimento)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
