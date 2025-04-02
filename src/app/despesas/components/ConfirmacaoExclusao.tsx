"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmacaoExclusaoProps {
  onConfirm: () => void;
  onCancel: () => void;
  id: number;
  descricao: string;
}

export default function ConfirmacaoExclusao({ onConfirm, onCancel, id, descricao }: ConfirmacaoExclusaoProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <FiAlertTriangle size={40} />
        </div>

        <h2 className="text-xl font-bold text-center mb-2">Confirmar Exclusão</h2>

        <p className="text-center text-gray-600 mb-6">
          Tem certeza que deseja excluir a despesa <br />
          <span className="font-medium">"{descricao}"</span>?
        </p>

        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
