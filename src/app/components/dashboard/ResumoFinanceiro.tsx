"use client";

import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Despesa } from "@/services/despesasService";
import { Receita } from "@/services/receitasService";

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ResumoFinanceiroProps {
  despesas: Despesa[];
  receitas: Receita[];
  formatarValor: (valor: number) => string;
}

export default function ResumoFinanceiro({ despesas, receitas, formatarValor }: ResumoFinanceiroProps) {
  // Dados para gráfico de pizza: Receitas vs Despesas
  const dadosBalanco = {
    labels: ["Receitas", "Despesas"],
    datasets: [
      {
        data: [receitas.reduce((acc, r) => acc + r.valor, 0), despesas.reduce((acc, d) => acc + d.valor, 0)],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Preparar dados por categoria de despesas
  const despesasPorCategoria = despesas.reduce((acc, despesa) => {
    acc[despesa.categoria] = (acc[despesa.categoria] || 0) + despesa.valor;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar categorias por valor
  const categorias = Object.keys(despesasPorCategoria).sort(
    (a, b) => despesasPorCategoria[b] - despesasPorCategoria[a]
  );
  const valoresPorCategoria = categorias.map((cat) => despesasPorCategoria[cat]);

  // Dados para gráfico de barras: Despesas por Categoria
  const dadosCategorias = {
    labels: categorias,
    datasets: [
      {
        label: "Valor por Categoria",
        data: valoresPorCategoria,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opções para gráfico de barras
  const opcoesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return formatarValor(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return formatarValor(value);
          },
        },
      },
    },
  };

  // Calcular totais
  const totalReceitas = receitas.reduce((acc, r) => acc + r.valor, 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza: Receitas vs Despesas */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Balanço: Receitas vs Despesas</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <Pie
              data={dadosBalanco}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${formatarValor(context.raw as number)}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Saldo:{" "}
              <span className={saldo >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {formatarValor(saldo)}
              </span>
            </p>
          </div>
        </div>

        {/* Gráfico de Barras: Despesas por Categoria */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Despesas por Categoria</h3>
          <div className="h-64 w-full">
            {categorias.length > 0 ? (
              <Bar data={dadosCategorias} options={opcoesBarras} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Nenhuma despesa registrada</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
