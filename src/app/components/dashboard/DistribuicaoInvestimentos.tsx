"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Investimento } from "@/services/investimentosService";

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface DistribuicaoInvestimentosProps {
  investimentos: Investimento[];
  formatarPreco: (valor: number) => string;
}

export default function DistribuicaoInvestimentos({ investimentos, formatarPreco }: DistribuicaoInvestimentosProps) {
  // Cores para os diferentes tipos de investimentos
  const coresPorTipo: Record<string, string> = {
    Ações: "rgba(255, 99, 132, 0.7)",
    "Fundos Imobiliários": "rgba(54, 162, 235, 0.7)",
    "Tesouro Direto": "rgba(255, 206, 86, 0.7)",
    CDB: "rgba(75, 192, 192, 0.7)",
    "LCI/LCA": "rgba(153, 102, 255, 0.7)",
    Criptomoedas: "rgba(255, 159, 64, 0.7)",
    "Fundos de Investimento": "rgba(199, 199, 199, 0.7)",
    Poupança: "rgba(83, 102, 255, 0.7)",
    Outros: "rgba(255, 99, 255, 0.7)",
  };

  const coresBordaPorTipo: Record<string, string> = {
    Ações: "rgb(255, 99, 132)",
    "Fundos Imobiliários": "rgb(54, 162, 235)",
    "Tesouro Direto": "rgb(255, 206, 86)",
    CDB: "rgb(75, 192, 192)",
    "LCI/LCA": "rgb(153, 102, 255)",
    Criptomoedas: "rgb(255, 159, 64)",
    "Fundos de Investimento": "rgb(199, 199, 199)",
    Poupança: "rgb(83, 102, 255)",
    Outros: "rgb(255, 99, 255)",
  };

  // Calcular total por tipo de investimento
  const totalPorTipo: Record<string, number> = {};

  investimentos.forEach((inv) => {
    const valorTotal = inv.valor * inv.quantidade;
    if (!totalPorTipo[inv.tipo]) {
      totalPorTipo[inv.tipo] = 0;
    }
    totalPorTipo[inv.tipo] += valorTotal;
  });

  // Ordenar tipos por valor total
  const tiposOrdenados = Object.keys(totalPorTipo).sort((a, b) => totalPorTipo[b] - totalPorTipo[a]);

  // Criar arrays para gráfico de pizza
  const valores = tiposOrdenados.map((tipo) => totalPorTipo[tipo]);
  const cores = tiposOrdenados.map((tipo) => coresPorTipo[tipo] || "rgba(128, 128, 128, 0.7)");
  const bordesCores = tiposOrdenados.map((tipo) => coresBordaPorTipo[tipo] || "rgb(128, 128, 128)");

  // Dados para o gráfico de pizza
  const dadosGrafico = {
    labels: tiposOrdenados,
    datasets: [
      {
        data: valores,
        backgroundColor: cores,
        borderColor: bordesCores,
        borderWidth: 1,
      },
    ],
  };

  // Calcular total por instituição
  const totalPorInstituicao: Record<string, number> = {};

  investimentos.forEach((inv) => {
    const valorTotal = inv.valor * inv.quantidade;
    if (!totalPorInstituicao[inv.instituicao]) {
      totalPorInstituicao[inv.instituicao] = 0;
    }
    totalPorInstituicao[inv.instituicao] += valorTotal;
  });

  // Ordenar instituições por valor total
  const instituicoesOrdenadas = Object.keys(totalPorInstituicao).sort(
    (a, b) => totalPorInstituicao[b] - totalPorInstituicao[a]
  );

  // Calcular valor total de todos os investimentos
  const valorTotalInvestimentos = investimentos.reduce((total, inv) => total + inv.valor * inv.quantidade, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Investimentos</h2>

      {investimentos.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Nenhum investimento registrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Pizza: Distribuição por Tipo */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">Por Tipo de Investimento</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={dadosGrafico}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const valor = context.raw as number;
                          const percentual = ((valor / valorTotalInvestimentos) * 100).toFixed(1);
                          return `${context.label}: ${formatarPreco(valor)} (${percentual}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Tabela: Top Instituições */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Por Instituição</h3>
            <div className="overflow-hidden shadow-sm rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Instituição
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Valor
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instituicoesOrdenadas.map((instituicao, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2 text-sm text-gray-900">{instituicao}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatarPreco(totalPorInstituicao[instituicao])}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {((totalPorInstituicao[instituicao] / valorTotalInvestimentos) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
