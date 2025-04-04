"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

interface FiltroFormProps {
  onClose: () => void;
  onFilter: (filtros: any) => void;
  filtrosAtuais?: {
    dataInicio?: string;
    dataFim?: string;
    valorMin?: number;
    valorMax?: number;
  };
}

export default function FiltroForm({ onClose, onFilter, filtrosAtuais = {} }: FiltroFormProps) {
  const [filtros, setFiltros] = useState({
    dataInicio: filtrosAtuais.dataInicio || "",
    dataFim: filtrosAtuais.dataFim || "",
    valorMin: filtrosAtuais.valorMin || "",
    valorMax: filtrosAtuais.valorMax || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
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
        return [key, value];
      })
    );

    onFilter(filtrosProcessados);
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      valorMin: "",
      valorMax: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">Filtrar Receitas</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <input
                type="date"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
              <input
                type="date"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button type="button" onClick={limparFiltros} className="px-4 py-2 text-green-600 hover:text-green-800">
              Limpar Filtros
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
