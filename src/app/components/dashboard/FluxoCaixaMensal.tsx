"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Despesa } from "@/services/despesasService";
import { Receita } from "@/services/receitasService";

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface FluxoCaixaMensalProps {
  despesas: Despesa[];
  receitas: Receita[];
  formatarValor: (valor: number) => string;
}

export default function FluxoCaixaMensal({ despesas, receitas, formatarValor }: FluxoCaixaMensalProps) {
  // Preparar dados por mês
  const dadosPorMes = () => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    // Inicializar valores para cada mês
    const receitasPorMes = Array(12).fill(0);
    const despesasPorMes = Array(12).fill(0);

    // Calcular total de receitas por mês
    receitas.forEach((receita) => {
      const data = new Date(receita.data);
      // Ajustar o fuso horário
      const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
      const mes = dataAjustada.getMonth();
      receitasPorMes[mes] += receita.valor;
    });

    // Calcular total de despesas por mês
    despesas.forEach((despesa) => {
      const data = new Date(despesa.data);
      // Ajustar o fuso horário
      const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
      const mes = dataAjustada.getMonth();
      despesasPorMes[mes] += despesa.valor;
    });

    // Calcular saldo para cada mês
    const saldoPorMes = receitasPorMes.map((receita, index) => receita - despesasPorMes[index]);

    return { meses, receitasPorMes, despesasPorMes, saldoPorMes };
  };

  const { meses, receitasPorMes, despesasPorMes, saldoPorMes } = dadosPorMes();

  // Obter mês atual e os últimos 5 meses para exibir no gráfico
  const mesAtual = new Date().getMonth();
  const ultimosMeses = [];
  const ultimosValoresReceitas = [];
  const ultimosValoresDespesas = [];
  const ultimosValoresSaldo = [];

  for (let i = 5; i >= 0; i--) {
    const indice = (mesAtual - i + 12) % 12; // Para garantir que índice seja positivo
    ultimosMeses.push(meses[indice]);
    ultimosValoresReceitas.push(receitasPorMes[indice]);
    ultimosValoresDespesas.push(despesasPorMes[indice]);
    ultimosValoresSaldo.push(saldoPorMes[indice]);
  }

  // Dados para o gráfico de linha
  const dadosGrafico = {
    labels: ultimosMeses,
    datasets: [
      {
        label: "Receitas",
        data: ultimosValoresReceitas,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
      {
        label: "Despesas",
        data: ultimosValoresDespesas,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
      {
        label: "Saldo",
        data: ultimosValoresSaldo,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Opções para o gráfico
  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatarValor(context.raw)}`;
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa Mensal</h2>

      <div className="h-80 w-full">
        {receitas.length > 0 || despesas.length > 0 ? (
          <Line data={dadosGrafico} options={opcoesGrafico} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Nenhum dado disponível para exibir o fluxo de caixa
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Resumo do Mês Atual</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Receitas</p>
            <p className="text-sm font-semibold">{formatarValor(receitasPorMes[mesAtual])}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-red-600 mb-1">Despesas</p>
            <p className="text-sm font-semibold">{formatarValor(despesasPorMes[mesAtual])}</p>
          </div>
          <div className={`p-3 rounded-lg ${saldoPorMes[mesAtual] >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
            <p className={`text-xs mb-1 ${saldoPorMes[mesAtual] >= 0 ? "text-blue-600" : "text-orange-600"}`}>Saldo</p>
            <p className="text-sm font-semibold">{formatarValor(saldoPorMes[mesAtual])}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
