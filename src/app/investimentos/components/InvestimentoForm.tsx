"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

interface InvestimentoFormProps {
  onClose: () => void;
  onSave: (investimento: any) => void;
  investimento?: {
    id?: number;
    descricao: string;
    valor: number;
    quantidade: number;
    tipo: string;
    instituicao: string;
  };
  tiposInvestimento: readonly string[];
}

export default function InvestimentoForm({ onClose, onSave, investimento, tiposInvestimento }: InvestimentoFormProps) {
  const [formData, setFormData] = useState({
    descricao: investimento?.descricao || "",
    valor: investimento?.valor || 0,
    quantidade: investimento?.quantidade || 0,
    tipo: investimento?.tipo || tiposInvestimento[0],
    instituicao: investimento?.instituicao || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valor" || name === "quantidade" ? parseFloat(value) || 0 : value,
    }));

    // Limpar erro se o campo foi preenchido
    if (errors[name] && value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (formData.valor <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }

    if (formData.quantidade <= 0) {
      newErrors.quantidade = "Quantidade deve ser maior que zero";
    }

    if (!formData.tipo) {
      newErrors.tipo = "Tipo é obrigatório";
    }

    if (!formData.instituicao.trim()) {
      newErrors.instituicao = "Instituição é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...(investimento?.id ? { id: investimento.id } : {}),
        ...formData,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">{investimento?.id ? "Editar Investimento" : "Novo Investimento"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.descricao ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
              }`}
              placeholder="Ex: PETR4"
            />
            {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Unitário (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.valor ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
                }`}
                placeholder="0,00"
              />
              {errors.valor && <p className="mt-1 text-sm text-red-500">{errors.valor}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="0.00001"
                step="0.00001"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.quantidade ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
                }`}
              />
              {errors.quantidade && <p className="mt-1 text-sm text-red-500">{errors.quantidade}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.tipo ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
              }`}
            >
              {tiposInvestimento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instituição <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="instituicao"
              value={formData.instituicao}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.instituicao ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
              }`}
              placeholder="Ex: XP Investimentos"
            />
            {errors.instituicao && <p className="mt-1 text-sm text-red-500">{errors.instituicao}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
