"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Investimento } from "@/services/investimentosService";

interface FiltroFormProps {
  onClose: () => void;
  onFilter: (filtros: any) => void;
  filtrosAtuais?: {
    valorMin?: number;
    valorMax?: number;
    tipos?: string[];
    instituicoes?: string[];
    dataInicio?: string;
    dataFim?: string;
  };
  investimentos?: Investimento[];
  tiposInvestimento: readonly string[];
}

export default function FiltroForm({
  onClose,
  onFilter,
  filtrosAtuais = {},
  investimentos = [],
  tiposInvestimento,
}: FiltroFormProps) {
  const [filtros, setFiltros] = useState({
    valorMin: filtrosAtuais.valorMin || "",
    valorMax: filtrosAtuais.valorMax || "",
    tipos: filtrosAtuais.tipos || [],
    instituicoes: filtrosAtuais.instituicoes || [],
    dataInicio: filtrosAtuais.dataInicio || "",
    dataFim: filtrosAtuais.dataFim || "",
  });

  // Lista de instituições disponíveis
  const [instituicoesDisponiveis, setInstituicoesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    // Extrair todas as instituições únicas se disponíveis
    if (investimentos && investimentos.length > 0) {
      const instituicoes = [...new Set(investimentos.map((inv) => inv.instituicao))];
      setInstituicoesDisponiveis(instituicoes);
    } else {
      // Se não houver investimentos, usar lista vazia
      setInstituicoesDisponiveis([]);
    }
  }, [investimentos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, array: "tipos" | "instituicoes") => {
    const { name, checked } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [array]: checked ? [...prev[array], name] : prev[array].filter((item) => item !== name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Converter strings vazias em undefined
    const filtrosProcessados = Object.fromEntries(
      Object.entries(filtros).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, value.trim() === "" ? undefined : value];
        }
        if (Array.isArray(value) && value.length === 0) {
          return [key, undefined];
        }
        return [key, value];
      })
    );

    onFilter(filtrosProcessados);
  };

  const limparFiltros = () => {
    setFiltros({
      valorMin: "",
      valorMax: "",
      tipos: [],
      instituicoes: [],
      dataInicio: "",
      dataFim: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">Filtrar Investimentos</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo (R$)</label>
              <input
                type="number"
                name="valorMin"
                value={filtros.valorMin}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Máximo (R$)</label>
              <input
                type="number"
                name="valorMax"
                value={filtros.valorMax}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Período de Compra</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">De</label>
                <input
                  type="date"
                  name="dataInicio"
                  value={filtros.dataInicio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Até</label>
                <input
                  type="date"
                  name="dataFim"
                  value={filtros.dataFim}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de Investimento</label>
            <div className="grid grid-cols-2 gap-2">
              {tiposInvestimento.map((tipo) => (
                <div key={tipo} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tipo-${tipo}`}
                    name={tipo}
                    checked={filtros.tipos.includes(tipo)}
                    onChange={(e) => handleCheckboxChange(e, "tipos")}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`tipo-${tipo}`} className="ml-2 text-sm text-gray-700">
                    {tipo}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {instituicoesDisponiveis.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instituições</label>
              <div className="grid grid-cols-2 gap-2">
                {instituicoesDisponiveis.map((instituicao) => (
                  <div key={instituicao} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`instituicao-${instituicao}`}
                      name={instituicao}
                      checked={filtros.instituicoes.includes(instituicao)}
                      onChange={(e) => handleCheckboxChange(e, "instituicoes")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`instituicao-${instituicao}`} className="ml-2 text-sm text-gray-700">
                      {instituicao}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={limparFiltros}
              className="px-4 py-2 text-purple-600 hover:text-purple-800 cursor-pointer"
            >
              Limpar Filtros
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
