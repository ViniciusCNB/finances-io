"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmacaoExclusaoProps {
  onClose: () => void;
  onConfirm: () => void;
  item: {
    descricao: string;
  };
}

export default function ConfirmacaoExclusao({ onClose, onConfirm, item }: ConfirmacaoExclusaoProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <FiAlertTriangle size={48} />
        </div>

        <h2 className="text-xl font-bold text-center mb-2">Confirmar Exclusão</h2>

        <p className="text-gray-700 text-center mb-6">
          Tem certeza que deseja excluir o investimento <strong>{item.descricao}</strong>? Esta ação não pode ser
          desfeita.
        </p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
