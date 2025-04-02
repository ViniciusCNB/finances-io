"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

interface ReceitaFormProps {
  onClose: () => void;
  onSave: (receita: any) => void;
  receita?: {
    id?: number;
    descricao: string;
    data: string;
    valor: number;
    observacao: string;
  };
}

export default function ReceitaForm({ onClose, onSave, receita }: ReceitaFormProps) {
  const [formData, setFormData] = useState({
    descricao: receita?.descricao || "",
    data: receita?.data || new Date().toISOString().split("T")[0],
    valor: receita?.valor || 0,
    observacao: receita?.observacao || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valor" ? parseFloat(value) || 0 : value,
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

    if (!formData.data) {
      newErrors.data = "Data é obrigatória";
    }

    if (formData.valor <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...(receita?.id ? { id: receita.id } : {}),
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

        <h2 className="text-xl font-bold mb-6">{receita?.id ? "Editar Receita" : "Nova Receita"}</h2>

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
                errors.descricao ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="Ex: Salário"
            />
            {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.data ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"
                }`}
              />
              {errors.data && <p className="mt-1 text-sm text-red-500">{errors.data}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.valor ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-green-200"
                }`}
                placeholder="0,00"
              />
              {errors.valor && <p className="mt-1 text-sm text-red-500">{errors.valor}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
            <textarea
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
