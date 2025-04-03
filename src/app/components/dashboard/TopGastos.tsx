"use client";

import { Despesa } from "@/services/despesasService";
import { FiArrowRight, FiInfo } from "react-icons/fi";
import Link from "next/link";

interface TopGastosProps {
  despesas: Despesa[];
  formatarValor: (valor: number) => string;
}

export default function TopGastos({ despesas, formatarValor }: TopGastosProps) {
  // Obter o mês atual para filtrar despesas
  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  // Filtrar despesas do mês atual
  const despesasDoMes = despesas.filter((despesa) => {
    const dataDespesa = new Date(despesa.data);
    return dataDespesa >= primeiroDiaDoMes && dataDespesa <= ultimoDiaDoMes;
  });

  // Ordenar despesas por valor (maior para menor)
  const despesasOrdenadas = [...despesasDoMes].sort((a, b) => b.valor - a.valor);

  // Pegar as 5 maiores despesas
  const topDespesas = despesasOrdenadas.slice(0, 5);

  // Agrupar e somar despesas por categoria
  const despesasPorCategoria: Record<string, number> = {};
  despesasDoMes.forEach((despesa) => {
    despesasPorCategoria[despesa.categoria] = (despesasPorCategoria[despesa.categoria] || 0) + despesa.valor;
  });

  // Ordenar categorias por valor total (maior para menor)
  const categoriasOrdenadas = Object.keys(despesasPorCategoria).sort(
    (a, b) => despesasPorCategoria[b] - despesasPorCategoria[a]
  );

  // Pegar as 5 maiores categorias
  const topCategorias = categoriasOrdenadas.slice(0, 5).map((categoria) => ({
    categoria,
    valor: despesasPorCategoria[categoria],
  }));

  // Calcular o total de despesas do mês
  const totalDespesasDoMes = despesasDoMes.reduce((acc, despesa) => acc + despesa.valor, 0);

  // Formatar data para exibição
  const formatarData = (dataStr: string): string => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Maiores Gastos do Mês</h2>
        <Link href="/despesas" className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
          Ver todas <FiArrowRight className="ml-1" />
        </Link>
      </div>

      {despesasDoMes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Não há despesas registradas para este mês</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 5 Maiores Gastos Individuais */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
              <span>Transações Mais Caras</span>
              <div className="group relative ml-2">
                <FiInfo className="text-gray-400 hover:text-gray-600 cursor-help" />
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  As 5 despesas com maior valor individual deste mês
                </div>
              </div>
            </h3>

            <div className="space-y-3">
              {topDespesas.map((despesa, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{despesa.descricao}</p>
                        <p className="text-xs text-gray-500">
                          {formatarData(despesa.data)} • {despesa.categoria}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{formatarValor(despesa.valor)}</p>
                    <p className="text-xs text-gray-500">
                      {((despesa.valor / totalDespesasDoMes) * 100).toFixed(1)}% do total
                    </p>
                  </div>
                </div>
              ))}

              {topDespesas.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Não há dados suficientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Top 5 Maiores Categorias */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
              <span>Maiores Categorias</span>
              <div className="group relative ml-2">
                <FiInfo className="text-gray-400 hover:text-gray-600 cursor-help" />
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  As 5 categorias com maior gasto acumulado neste mês
                </div>
              </div>
            </h3>

            <div className="space-y-3">
              {topCategorias.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-800">{item.categoria}</p>
                    <p className="text-sm font-semibold text-gray-800">{formatarValor(item.valor)}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (item.valor / totalDespesasDoMes) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {((item.valor / totalDespesasDoMes) * 100).toFixed(1)}% do total
                  </p>
                </div>
              ))}

              {topCategorias.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Não há dados suficientes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
